import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ShapeId } from '../types/learning';

export type CameraPreset = 'iso' | 'front' | 'top' | 'side';

export interface ShapeDimensions {
  p: number; // cm (kubus: s, prisma: alas segitiga, limas: sisi alas)
  l: number; // cm (balok: lebar, prisma: tinggi segitiga, limas: lebar alas)
  t: number; // cm (tinggi bangun)
  r: number; // cm (jari-jari tabung, kerucut, bola)
}

export interface ViewerToggles {
  showFaces: boolean;
  showEdges: boolean;
  showVertices: boolean;
  highlightBaseTop: boolean;
  showDimensions: boolean;
  netOpen: number; // 0 to 1
}

interface DimensionLabelSpec {
  key: string;
  text: string;
  pos: THREE.Vector3;
  colorClass: string;
}

interface Shape3DViewerProps {
  shapeId: ShapeId;
  dimensions: ShapeDimensions;
  toggles: ViewerToggles;
  cameraPreset: CameraPreset;
  presetVersion: number;
  selectedPart: string | null;
  onSelectPart: (partId: string | null) => void;
  onWebGLError?: (msg: string) => void;
}

const WORLD_SCALE = 0.42;

const _projVec = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3();
const _targetCtrlTarget = new THREE.Vector3();

function detectSoftwareGl(): boolean {
  try {
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function makeTriGeometry(
  p0: [number, number, number],
  p1: [number, number, number],
  p2: [number, number, number],
): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array([...p0, ...p1, ...p2]);
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}

function makeEdgeTube(
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  material: THREE.Material,
  partId: string,
): THREE.Mesh {
  const dir = new THREE.Vector3().subVectors(end, start);
  const len = Math.max(dir.length(), 0.001);
  const geo = new THREE.CylinderGeometry(radius, radius, len, 8, 1);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.copy(start).addScaledVector(dir, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  mesh.userData.partId = partId;
  return mesh;
}

function makeFaceEdgesOutline(
  points: THREE.Vector3[],
  material: THREE.LineBasicMaterial,
): THREE.LineLoop {
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.LineLoop(geo, material);
}

function disposeObjectTree(root: THREE.Object3D): void {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.LineSegments || obj instanceof THREE.LineLoop) {
      obj.geometry?.dispose();
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => m.dispose());
      } else {
        obj.material?.dispose();
      }
    }
  });
}

export function Shape3DViewer({
  shapeId,
  dimensions,
  toggles,
  cameraPreset,
  presetVersion,
  selectedPart,
  onSelectPart,
  onWebGLError,
}: Shape3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelsDataRef = useRef<DimensionLabelSpec[]>([]);

  const stateRef = useRef({
    shapeId,
    dimensions,
    toggles,
    selectedPart,
  });
  stateRef.current = { shapeId, dimensions, toggles, selectedPart };

  const onSelectPartRef = useRef(onSelectPart);
  onSelectPartRef.current = onSelectPart;

  const engineRef = useRef<{
    rebuildShape: () => void;
    applyPreset: (preset: CameraPreset) => void;
    requestRender: () => void;
    updateHighlights: () => void;
  } | null>(null);

  // Initialize Three.js WebGL scene once
  useEffect(() => {
    const mount = mountRef.current;
    const container = containerRef.current;
    if (!mount || !container) return;

    const isSoftwareGl = detectSoftwareGl();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      onWebGLError?.('Perangkat atau peramban Anda belum mendukung WebGL 3D.');
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(mount.clientWidth || 640, mount.clientHeight || 480);
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f9ff);
    scene.fog = new THREE.Fog(0xf0f9ff, 14, 34);

    // Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const width = mount.clientWidth || 640;
    const height = mount.clientHeight || 480;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(4.8, 4.1, 5.6);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.2;
    controls.maxDistance = 16;
    controls.maxPolarAngle = Math.PI * 0.88;
    controls.target.set(0, 0.9, 0);

    // Three-point warm/cool lighting
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xdbeafe, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.55);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -6;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.65);
    rimLight.position.set(-5, 4, -5);
    scene.add(rimLight);

    // Ground stage + subtle grid
    const floorGeo = new THREE.CircleGeometry(12, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      roughness: 0.92,
      metalness: 0.0,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.025;
    floor.receiveShadow = !isSoftwareGl;
    scene.add(floor);

    const grid = new THREE.GridHelper(12, 24, 0x7dd3fc, 0xbae6fd);
    grid.position.y = -0.02;
    scene.add(grid);

    const shapeGroup = new THREE.Group();
    scene.add(shapeGroup);

    // Dynamic state inside scene closure
    let currentNetOpen = stateRef.current.toggles.netOpen;
    let camTransitionActive = false;
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();
    let netUpdater: ((openVal: number) => void) | null = null;
    let clickables: THREE.Object3D[] = [];

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function updateProjectedLabels() {
      const w = mount?.clientWidth || 1;
      const h = mount?.clientHeight || 1;
      const show = stateRef.current.toggles.showDimensions && currentNetOpen < 0.15;
      const specs = labelsDataRef.current;

      for (let i = 0; i < 4; i++) {
        const el = labelRefs.current[i];
        if (!el) continue;
        if (!show || i >= specs.length) {
          el.style.opacity = '0';
          continue;
        }
        const spec = specs[i];
        _projVec.copy(spec.pos).project(camera);
        if (_projVec.z > 1) {
          el.style.opacity = '0';
          continue;
        }
        const x = ((_projVec.x + 1) / 2) * w;
        const y = ((-_projVec.y + 1) / 2) * h;
        el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        el.style.opacity = '1';
      }
    }

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        renderDirty = false;
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        let needsMore = false;
        const targetNet = stateRef.current.toggles.netOpen;
        if (Math.abs(currentNetOpen - targetNet) > 0.002) {
          currentNetOpen = THREE.MathUtils.damp(currentNetOpen, targetNet, 8, dt);
          if (Math.abs(currentNetOpen - targetNet) <= 0.002) {
            currentNetOpen = targetNet;
          } else {
            needsMore = true;
          }
          netUpdater?.(currentNetOpen);
          shapeGroup.traverse((obj) => {
            if (obj.userData.partId === 'tinggi') {
              obj.visible = stateRef.current.toggles.showDimensions && currentNetOpen < 0.15;
            }
          });
        }

        if (camTransitionActive) {
          const factor = 1 - Math.exp(-8 * dt);
          camera.position.lerp(_targetCamPos, factor);
          controls.target.lerp(_targetCtrlTarget, factor);
          if (
            camera.position.distanceTo(_targetCamPos) < 0.02 &&
            controls.target.distanceTo(_targetCtrlTarget) < 0.02
          ) {
            camera.position.copy(_targetCamPos);
            controls.target.copy(_targetCtrlTarget);
            camTransitionActive = false;
          } else {
            needsMore = true;
          }
        }

        const ctrlMoving = controls.update();
        if (ctrlMoving) needsMore = true;

        renderer.render(scene, camera);
        updateProjectedLabels();

        const done = () => {
          renderBusy = false;
          if (renderDirty || needsMore) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    function updateHighlights() {
      const { selectedPart: sel, toggles: tog } = stateRef.current;
      shapeGroup.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        const partId = obj.userData.partId as string | undefined;
        const mat = obj.material;
        if (!(mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial)) return;

        if (obj.userData.isFace) {
          const baseColor = obj.userData.baseColor as number;
          const isBaseOrTop = partId === 'alas' || partId === 'tutup';
          if (sel && sel === partId) {
            mat.color.setHex(0xf59e0b);
            mat.emissive.setHex(0xb45309);
            mat.emissiveIntensity = 0.35;
            mat.opacity = 0.92;
          } else if (tog.highlightBaseTop && partId === 'alas') {
            mat.color.setHex(0x10b981);
            mat.emissive.setHex(0x047857);
            mat.emissiveIntensity = 0.22;
            mat.opacity = 0.88;
          } else if (tog.highlightBaseTop && partId === 'tutup') {
            mat.color.setHex(0xfacc15);
            mat.emissive.setHex(0xca8a04);
            mat.emissiveIntensity = 0.2;
            mat.opacity = 0.88;
          } else {
            mat.color.setHex(baseColor);
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
            mat.opacity = isBaseOrTop ? 0.84 : 0.72;
          }
          obj.visible = tog.showFaces;
        } else if (partId === 'rusuk') {
          if (sel === 'rusuk') {
            mat.color.setHex(0xf59e0b);
            mat.emissive.setHex(0xb45309);
            mat.emissiveIntensity = 0.4;
          } else {
            mat.color.setHex(0x0369a1);
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
          }
          obj.visible = tog.showEdges;
        } else if (partId === 'titikSudut') {
          if (sel === 'titikSudut') {
            mat.color.setHex(0xef4444);
            mat.emissive.setHex(0xb91c1c);
            mat.emissiveIntensity = 0.45;
          } else {
            mat.color.setHex(0xf59e0b);
            mat.emissive.setHex(0x78350f);
            mat.emissiveIntensity = 0.15;
          }
          obj.visible = tog.showVertices;
        } else if (partId === 'tinggi') {
          obj.visible = tog.showDimensions && currentNetOpen < 0.2;
        }
      });
      requestRender();
    }

    function rebuildShape() {
      disposeObjectTree(shapeGroup);
      shapeGroup.clear();
      clickables = [];
      netUpdater = null;

      const { shapeId: sid, dimensions: dims, toggles: tog } = stateRef.current;

      const makeFaceMat = (hex: number) =>
        new THREE.MeshPhysicalMaterial({
          color: hex,
          roughness: 0.25,
          metalness: 0.05,
          clearcoat: 0.5,
          clearcoatRoughness: 0.2,
          transparent: true,
          opacity: 0.78,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

      const edgeMat = new THREE.MeshStandardMaterial({
        color: 0x0369a1,
        roughness: 0.35,
        metalness: 0.3,
      });

      const outlineMat = new THREE.LineBasicMaterial({
        color: 0x0c4a6e,
        transparent: true,
        opacity: 0.65,
      });

      const vertexMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.25,
        metalness: 0.2,
      });

      const dimMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.3,
        metalness: 0.1,
      });

      const registerFace = (mesh: THREE.Mesh, partId: string, baseColor: number) => {
        mesh.userData.partId = partId;
        mesh.userData.isFace = true;
        mesh.userData.baseColor = baseColor;
        mesh.castShadow = !isSoftwareGl;
        clickables.push(mesh);
      };

      const registerVertex = (pos: THREE.Vector3, parent: THREE.Object3D = shapeGroup) => {
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), vertexMat.clone());
        dot.position.copy(pos);
        dot.userData.partId = 'titikSudut';
        parent.add(dot);
        clickables.push(dot);
      };

      const addEdge = (a: THREE.Vector3, b: THREE.Vector3, parent: THREE.Object3D = shapeGroup) => {
        const tube = makeEdgeTube(a, b, 0.032, edgeMat.clone(), 'rusuk');
        parent.add(tube);
        clickables.push(tube);
      };

      const addDimShaft = (a: THREE.Vector3, b: THREE.Vector3) => {
        const rod = makeEdgeTube(a, b, 0.026, dimMat.clone(), 'tinggi');
        shapeGroup.add(rod);
        clickables.push(rod);
        const capA = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), dimMat.clone());
        capA.position.copy(a);
        capA.userData.partId = 'tinggi';
        const capB = capA.clone();
        capB.position.copy(b);
        shapeGroup.add(capA, capB);
      };

      const newLabels: DimensionLabelSpec[] = [];

      if (sid === 'kubus' || sid === 'balok') {
        const w = (sid === 'kubus' ? dims.p : dims.p) * WORLD_SCALE;
        const d = (sid === 'kubus' ? dims.p : dims.l) * WORLD_SCALE;
        const h = (sid === 'kubus' ? dims.p : dims.t) * WORLD_SCALE;

        const addQuadFace = (
          widthQ: number,
          depthQ: number,
          cx: number,
          cz: number,
          partId: string,
          color: number,
          parent: THREE.Object3D,
        ) => {
          const geo = new THREE.PlaneGeometry(widthQ, depthQ);
          geo.rotateX(-Math.PI / 2);
          const mesh = new THREE.Mesh(geo, makeFaceMat(color));
          mesh.position.set(cx, 0, cz);
          registerFace(mesh, partId, color);
          parent.add(mesh);

          const hw = widthQ / 2;
          const hd = depthQ / 2;
          const outline = makeFaceEdgesOutline(
            [
              new THREE.Vector3(cx - hw, 0.005, cz - hd),
              new THREE.Vector3(cx + hw, 0.005, cz - hd),
              new THREE.Vector3(cx + hw, 0.005, cz + hd),
              new THREE.Vector3(cx - hw, 0.005, cz + hd),
            ],
            outlineMat.clone(),
          );
          parent.add(outline);
        };

        // Base (alas)
        addQuadFace(w, d, 0, 0, 'alas', 0x38bdf8, shapeGroup);

        // Hinges
        const frontHinge = new THREE.Group();
        frontHinge.position.set(0, 0, d / 2);
        addQuadFace(w, h, 0, h / 2, 'sisi', 0x0ea5e9, frontHinge);
        shapeGroup.add(frontHinge);

        const backHinge = new THREE.Group();
        backHinge.position.set(0, 0, -d / 2);
        addQuadFace(w, h, 0, -h / 2, 'sisi', 0x0ea5e9, backHinge);
        shapeGroup.add(backHinge);

        const leftHinge = new THREE.Group();
        leftHinge.position.set(-w / 2, 0, 0);
        addQuadFace(h, d, -h / 2, 0, 'sisi', 0x0284c7, leftHinge);
        shapeGroup.add(leftHinge);

        const rightHinge = new THREE.Group();
        rightHinge.position.set(w / 2, 0, 0);
        addQuadFace(h, d, h / 2, 0, 'sisi', 0x0284c7, rightHinge);
        shapeGroup.add(rightHinge);

        const topHinge = new THREE.Group();
        topHinge.position.set(0, 0, -h);
        addQuadFace(w, d, 0, -d / 2, 'tutup', 0x38bdf8, topHinge);
        backHinge.add(topHinge);

        // Static box edges & vertices (fade/hide when net opens)
        const boxFrame = new THREE.Group();
        const v = [
          new THREE.Vector3(-w / 2, 0, -d / 2),
          new THREE.Vector3(w / 2, 0, -d / 2),
          new THREE.Vector3(w / 2, 0, d / 2),
          new THREE.Vector3(-w / 2, 0, d / 2),
          new THREE.Vector3(-w / 2, h, -d / 2),
          new THREE.Vector3(w / 2, h, -d / 2),
          new THREE.Vector3(w / 2, h, d / 2),
          new THREE.Vector3(-w / 2, h, d / 2),
        ];
        const pairs = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ];
        pairs.forEach(([i, j]) => addEdge(v[i], v[j], boxFrame));
        v.forEach((pt) => registerVertex(pt, boxFrame));
        shapeGroup.add(boxFrame);

        // Internal height rod
        addDimShaft(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, h, 0));

        if (sid === 'kubus') {
          newLabels.push(
            { key: 'p', text: `s = ${dims.p} cm`, pos: new THREE.Vector3(0, -0.15, d / 2 + 0.2), colorClass: 'bg-sky-700 text-white' },
            { key: 't', text: `s = ${dims.p} cm`, pos: new THREE.Vector3(w / 2 + 0.25, h / 2, d / 2), colorClass: 'bg-red-600 text-white' },
          );
        } else {
          newLabels.push(
            { key: 'p', text: `p = ${dims.p} cm`, pos: new THREE.Vector3(0, -0.15, d / 2 + 0.22), colorClass: 'bg-sky-700 text-white' },
            { key: 'l', text: `l = ${dims.l} cm`, pos: new THREE.Vector3(w / 2 + 0.25, -0.15, 0), colorClass: 'bg-emerald-700 text-white' },
            { key: 't', text: `t = ${dims.t} cm`, pos: new THREE.Vector3(0, h / 2, 0), colorClass: 'bg-red-600 text-white' },
          );
        }

        netUpdater = (openVal: number) => {
          const a = (1 - openVal) * (Math.PI / 2);
          frontHinge.rotation.x = -a;
          backHinge.rotation.x = a;
          leftHinge.rotation.z = -a;
          rightHinge.rotation.z = a;
          topHinge.rotation.x = a;
          boxFrame.visible = openVal < 0.04;
        };
      } else if (sid === 'prisma') {
        const w = dims.p * WORLD_SCALE;
        const th = dims.l * WORLD_SCALE;
        const len = dims.t * WORLD_SCALE;
        const slant = Math.hypot(w / 2, th);
        const alpha = Math.atan2(th, w / 2);

        // Bottom rectangular face
        const botGeo = new THREE.PlaneGeometry(w, len);
        botGeo.rotateX(-Math.PI / 2);
        const botMesh = new THREE.Mesh(botGeo, makeFaceMat(0x0ea5e9));
        registerFace(botMesh, 'sisi', 0x0ea5e9);
        shapeGroup.add(botMesh);

        // Front triangle (alas)
        const frontTriHinge = new THREE.Group();
        frontTriHinge.position.set(0, 0, len / 2);
        const fTriGeo = makeTriGeometry([-w / 2, 0, 0], [w / 2, 0, 0], [0, 0, th]);
        const fTriMesh = new THREE.Mesh(fTriGeo, makeFaceMat(0x38bdf8));
        registerFace(fTriMesh, 'alas', 0x38bdf8);
        frontTriHinge.add(fTriMesh);
        frontTriHinge.add(
          makeFaceEdgesOutline(
            [new THREE.Vector3(-w / 2, 0.005, 0), new THREE.Vector3(w / 2, 0.005, 0), new THREE.Vector3(0, 0.005, th)],
            outlineMat.clone(),
          ),
        );
        shapeGroup.add(frontTriHinge);

        // Back triangle (tutup)
        const backTriHinge = new THREE.Group();
        backTriHinge.position.set(0, 0, -len / 2);
        const bTriGeo = makeTriGeometry([w / 2, 0, 0], [-w / 2, 0, 0], [0, 0, -th]);
        const bTriMesh = new THREE.Mesh(bTriGeo, makeFaceMat(0x38bdf8));
        registerFace(bTriMesh, 'tutup', 0x38bdf8);
        backTriHinge.add(bTriMesh);
        backTriHinge.add(
          makeFaceEdgesOutline(
            [new THREE.Vector3(-w / 2, 0.005, 0), new THREE.Vector3(w / 2, 0.005, 0), new THREE.Vector3(0, 0.005, -th)],
            outlineMat.clone(),
          ),
        );
        shapeGroup.add(backTriHinge);

        // Left slanted side
        const leftHinge = new THREE.Group();
        leftHinge.position.set(-w / 2, 0, 0);
        const lGeo = new THREE.PlaneGeometry(slant, len);
        lGeo.rotateX(-Math.PI / 2);
        const lMesh = new THREE.Mesh(lGeo, makeFaceMat(0x0284c7));
        lMesh.position.set(-slant / 2, 0, 0);
        registerFace(lMesh, 'sisi', 0x0284c7);
        leftHinge.add(lMesh);
        leftHinge.add(
          makeFaceEdgesOutline(
            [
              new THREE.Vector3(0, 0.005, -len / 2),
              new THREE.Vector3(-slant, 0.005, -len / 2),
              new THREE.Vector3(-slant, 0.005, len / 2),
              new THREE.Vector3(0, 0.005, len / 2),
            ],
            outlineMat.clone(),
          ),
        );
        shapeGroup.add(leftHinge);

        // Right slanted side
        const rightHinge = new THREE.Group();
        rightHinge.position.set(w / 2, 0, 0);
        const rGeo = new THREE.PlaneGeometry(slant, len);
        rGeo.rotateX(-Math.PI / 2);
        const rMesh = new THREE.Mesh(rGeo, makeFaceMat(0x0284c7));
        rMesh.position.set(slant / 2, 0, 0);
        registerFace(rMesh, 'sisi', 0x0284c7);
        rightHinge.add(rMesh);
        rightHinge.add(
          makeFaceEdgesOutline(
            [
              new THREE.Vector3(0, 0.005, -len / 2),
              new THREE.Vector3(slant, 0.005, -len / 2),
              new THREE.Vector3(slant, 0.005, len / 2),
              new THREE.Vector3(0, 0.005, len / 2),
            ],
            outlineMat.clone(),
          ),
        );
        shapeGroup.add(rightHinge);

        // Static frame edges & vertices
        const frame = new THREE.Group();
        const v = [
          new THREE.Vector3(-w / 2, 0, len / 2),
          new THREE.Vector3(w / 2, 0, len / 2),
          new THREE.Vector3(0, th, len / 2),
          new THREE.Vector3(-w / 2, 0, -len / 2),
          new THREE.Vector3(w / 2, 0, -len / 2),
          new THREE.Vector3(0, th, -len / 2),
        ];
        [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3], [0, 3], [1, 4], [2, 5]].forEach(([i, j]) =>
          addEdge(v[i], v[j], frame),
        );
        v.forEach((pt) => registerVertex(pt, frame));
        shapeGroup.add(frame);

        addDimShaft(new THREE.Vector3(0, 0, len / 2), new THREE.Vector3(0, th, len / 2));

        newLabels.push(
          { key: 'p', text: `alas Δ = ${dims.p} cm`, pos: new THREE.Vector3(0, -0.18, len / 2 + 0.15), colorClass: 'bg-sky-700 text-white' },
          { key: 'l', text: `t Δ = ${dims.l} cm`, pos: new THREE.Vector3(0, th / 2, len / 2 + 0.2), colorClass: 'bg-red-600 text-white' },
          { key: 't', text: `t prisma = ${dims.t} cm`, pos: new THREE.Vector3(w / 2 + 0.3, 0.05, 0), colorClass: 'bg-emerald-700 text-white' },
        );

        netUpdater = (openVal: number) => {
          const aTri = (1 - openVal) * (Math.PI / 2);
          frontTriHinge.rotation.x = -aTri;
          backTriHinge.rotation.x = aTri;
          const aSide = (1 - openVal) * (Math.PI - alpha);
          leftHinge.rotation.z = -aSide;
          rightHinge.rotation.z = aSide;
          frame.visible = openVal < 0.04;
        };
      } else if (sid === 'limas') {
        const w = dims.p * WORLD_SCALE;
        const d = dims.l * WORLD_SCALE;
        const h = dims.t * WORLD_SCALE;

        const baseGeo = new THREE.PlaneGeometry(w, d);
        baseGeo.rotateX(-Math.PI / 2);
        const baseMesh = new THREE.Mesh(baseGeo, makeFaceMat(0x38bdf8));
        registerFace(baseMesh, 'alas', 0x38bdf8);
        shapeGroup.add(baseMesh);
        shapeGroup.add(
          makeFaceEdgesOutline(
            [
              new THREE.Vector3(-w / 2, 0.005, -d / 2),
              new THREE.Vector3(w / 2, 0.005, -d / 2),
              new THREE.Vector3(w / 2, 0.005, d / 2),
              new THREE.Vector3(-w / 2, 0.005, d / 2),
            ],
            outlineMat.clone(),
          ),
        );

        const sFB = Math.hypot(d / 2, h);
        const foldFB = Math.PI - Math.atan2(h, d / 2);
        const sLR = Math.hypot(w / 2, h);
        const foldLR = Math.PI - Math.atan2(h, w / 2);

        const frontHinge = new THREE.Group();
        frontHinge.position.set(0, 0, d / 2);
        const fMesh = new THREE.Mesh(makeTriGeometry([-w / 2, 0, 0], [w / 2, 0, 0], [0, 0, sFB]), makeFaceMat(0x0ea5e9));
        registerFace(fMesh, 'sisi', 0x0ea5e9);
        frontHinge.add(fMesh);
        frontHinge.add(makeFaceEdgesOutline([new THREE.Vector3(-w / 2, 0.005, 0), new THREE.Vector3(w / 2, 0.005, 0), new THREE.Vector3(0, 0.005, sFB)], outlineMat.clone()));
        shapeGroup.add(frontHinge);

        const backHinge = new THREE.Group();
        backHinge.position.set(0, 0, -d / 2);
        const bMesh = new THREE.Mesh(makeTriGeometry([w / 2, 0, 0], [-w / 2, 0, 0], [0, 0, -sFB]), makeFaceMat(0x0ea5e9));
        registerFace(bMesh, 'sisi', 0x0ea5e9);
        backHinge.add(bMesh);
        backHinge.add(makeFaceEdgesOutline([new THREE.Vector3(-w / 2, 0.005, 0), new THREE.Vector3(w / 2, 0.005, 0), new THREE.Vector3(0, 0.005, -sFB)], outlineMat.clone()));
        shapeGroup.add(backHinge);

        const leftHinge = new THREE.Group();
        leftHinge.position.set(-w / 2, 0, 0);
        const lMesh = new THREE.Mesh(makeTriGeometry([0, 0, -d / 2], [0, 0, d / 2], [-sLR, 0, 0]), makeFaceMat(0x0284c7));
        registerFace(lMesh, 'sisi', 0x0284c7);
        leftHinge.add(lMesh);
        leftHinge.add(makeFaceEdgesOutline([new THREE.Vector3(0, 0.005, -d / 2), new THREE.Vector3(0, 0.005, d / 2), new THREE.Vector3(-sLR, 0.005, 0)], outlineMat.clone()));
        shapeGroup.add(leftHinge);

        const rightHinge = new THREE.Group();
        rightHinge.position.set(w / 2, 0, 0);
        const rMesh = new THREE.Mesh(makeTriGeometry([0, 0, d / 2], [0, 0, -d / 2], [sLR, 0, 0]), makeFaceMat(0x0284c7));
        registerFace(rMesh, 'sisi', 0x0284c7);
        rightHinge.add(rMesh);
        rightHinge.add(makeFaceEdgesOutline([new THREE.Vector3(0, 0.005, -d / 2), new THREE.Vector3(0, 0.005, d / 2), new THREE.Vector3(sLR, 0.005, 0)], outlineMat.clone()));
        shapeGroup.add(rightHinge);

        const frame = new THREE.Group();
        const apex = new THREE.Vector3(0, h, 0);
        const corners = [
          new THREE.Vector3(-w / 2, 0, -d / 2),
          new THREE.Vector3(w / 2, 0, -d / 2),
          new THREE.Vector3(w / 2, 0, d / 2),
          new THREE.Vector3(-w / 2, 0, d / 2),
        ];
        for (let i = 0; i < 4; i++) {
          addEdge(corners[i], corners[(i + 1) % 4], frame);
          addEdge(corners[i], apex, frame);
          registerVertex(corners[i], frame);
        }
        registerVertex(apex, frame);
        shapeGroup.add(frame);

        addDimShaft(new THREE.Vector3(0, 0, 0), apex);

        newLabels.push(
          { key: 'p', text: `p = ${dims.p} cm`, pos: new THREE.Vector3(0, -0.18, d / 2 + 0.2), colorClass: 'bg-sky-700 text-white' },
          { key: 'l', text: `l = ${dims.l} cm`, pos: new THREE.Vector3(w / 2 + 0.25, -0.18, 0), colorClass: 'bg-emerald-700 text-white' },
          { key: 't', text: `t = ${dims.t} cm`, pos: new THREE.Vector3(0.2, h * 0.52, 0), colorClass: 'bg-red-600 text-white' },
        );

        netUpdater = (openVal: number) => {
          const k = 1 - openVal;
          frontHinge.rotation.x = -k * foldFB;
          backHinge.rotation.x = k * foldFB;
          leftHinge.rotation.z = -k * foldLR;
          rightHinge.rotation.z = k * foldLR;
          frame.visible = openVal < 0.04;
        };
      } else if (sid === 'tabung') {
        const rad = dims.r * WORLD_SCALE;
        const h = dims.t * WORLD_SCALE;
        const segs = 48;

        // Bottom circle (alas)
        const baseGeo = new THREE.CircleGeometry(rad, segs);
        baseGeo.rotateX(-Math.PI / 2);
        const baseMesh = new THREE.Mesh(baseGeo, makeFaceMat(0x38bdf8));
        registerFace(baseMesh, 'alas', 0x38bdf8);
        shapeGroup.add(baseMesh);

        // Top circle (tutup) hinged at back edge (0, h, -rad)
        const topHinge = new THREE.Group();
        topHinge.position.set(0, h, -rad);
        const topGeo = new THREE.CircleGeometry(rad, segs);
        topGeo.rotateX(-Math.PI / 2);
        const topMesh = new THREE.Mesh(topGeo, makeFaceMat(0x38bdf8));
        topMesh.position.set(0, 0, rad);
        registerFace(topMesh, 'tutup', 0x38bdf8);
        topHinge.add(topMesh);
        shapeGroup.add(topHinge);

        // Unrolling curved selimut mesh (anchored at back line x=0, z=-rad)
        const selGeo = new THREE.BufferGeometry();
        const vertCount = (segs + 1) * 2;
        const positions = new Float32Array(vertCount * 3);
        const indices: number[] = [];
        for (let i = 0; i < segs; i++) {
          const a = i * 2;
          const b = a + 1;
          const c = a + 2;
          const d = a + 3;
          indices.push(a, c, b, b, c, d);
        }
        selGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        selGeo.setIndex(indices);
        const selMesh = new THREE.Mesh(selGeo, makeFaceMat(0x0ea5e9));
        registerFace(selMesh, 'sisi', 0x0ea5e9);
        shapeGroup.add(selMesh);

        const updateCylinderWall = (openVal: number) => {
          const arcLen = 2 * Math.PI * rad;
          const phiTotal = THREE.MathUtils.lerp(2 * Math.PI, 0.02, openVal);
          const curR = arcLen / phiTotal;
          const posAttr = selGeo.attributes.position as THREE.BufferAttribute;

          for (let i = 0; i <= segs; i++) {
            const t = i / segs - 0.5; // -0.5 to +0.5
            const angle = t * phiTotal;
            const x = curR * Math.sin(angle);
            const z = -rad + curR * (1 - Math.cos(angle));
            posAttr.setXYZ(i * 2, x, 0, z);
            posAttr.setXYZ(i * 2 + 1, x, h, z);
          }
          posAttr.needsUpdate = true;
          selGeo.computeVertexNormals();
          selGeo.computeBoundingSphere();
        };
        updateCylinderWall(currentNetOpen);

        // Curved edges (rusuk lengkung)
        const ringFrame = new THREE.Group();
        const ringGeoBot = new THREE.TorusGeometry(rad, 0.03, 12, segs);
        ringGeoBot.rotateX(Math.PI / 2);
        const botRing = new THREE.Mesh(ringGeoBot, edgeMat.clone());
        botRing.userData.partId = 'rusuk';
        const topRing = new THREE.Mesh(ringGeoBot.clone(), edgeMat.clone());
        topRing.position.y = h;
        topRing.userData.partId = 'rusuk';
        ringFrame.add(botRing, topRing);
        clickables.push(botRing, topRing);
        shapeGroup.add(ringFrame);

        // Height + radius rods
        addDimShaft(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, h, 0));
        addDimShaft(new THREE.Vector3(0, 0.015, 0), new THREE.Vector3(rad, 0.015, 0));

        newLabels.push(
          { key: 'r', text: `r = ${dims.r} cm`, pos: new THREE.Vector3(rad * 0.55, 0.14, 0.15), colorClass: 'bg-emerald-700 text-white' },
          { key: 't', text: `t = ${dims.t} cm`, pos: new THREE.Vector3(-0.25, h / 2, 0), colorClass: 'bg-red-600 text-white' },
        );

        netUpdater = (openVal: number) => {
          updateCylinderWall(openVal);
          topHinge.rotation.x = -openVal * (Math.PI / 2);
          ringFrame.visible = openVal < 0.04;
        };
      } else if (sid === 'kerucut') {
        const rad = dims.r * WORLD_SCALE;
        const h = dims.t * WORLD_SCALE;
        const s = Math.hypot(rad, h);
        const segs = 48;

        // Base circle
        const baseGeo = new THREE.CircleGeometry(rad, segs);
        baseGeo.rotateX(-Math.PI / 2);
        const baseMesh = new THREE.Mesh(baseGeo, makeFaceMat(0x38bdf8));
        registerFace(baseMesh, 'alas', 0x38bdf8);
        shapeGroup.add(baseMesh);

        // Cone lateral surface morphing cleanly into flat circular sector
        const coneGeo = new THREE.BufferGeometry();
        const vertCount = (segs + 1) * 2;
        const positions = new Float32Array(vertCount * 3);
        const indices: number[] = [];
        for (let i = 0; i < segs; i++) {
          const a = i * 2;
          const b = a + 1;
          const c = a + 2;
          const d = a + 3;
          indices.push(a, c, b, b, c, d);
        }
        coneGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        coneGeo.setIndex(indices);
        const coneMesh = new THREE.Mesh(coneGeo, makeFaceMat(0x0ea5e9));
        registerFace(coneMesh, 'sisi', 0x0ea5e9);
        shapeGroup.add(coneMesh);

        const sectorAngle = (2 * Math.PI * rad) / s;

        const updateConeSurface = (openVal: number) => {
          const posAttr = coneGeo.attributes.position as THREE.BufferAttribute;
          // Closed apex = (0, h, 0); Open apex moves back to (0, 0, -rad - s)
          const apexZ = THREE.MathUtils.lerp(0, -rad - s, openVal);
          const apexY = THREE.MathUtils.lerp(h, 0.01, openVal);

          for (let i = 0; i <= segs; i++) {
            const frac = i / segs - 0.5; // -0.5..0.5
            // Closed ring point
            const closedAngle = frac * 2 * Math.PI + Math.PI; // 0 at back seam (0,0,-rad)
            const cx = rad * Math.sin(closedAngle);
            const cz = rad * Math.cos(closedAngle);

            // Flat sector point anchored from apex (0, 0, -rad - s) pointing toward +Z
            const openAngle = frac * sectorAngle;
            const ox = s * Math.sin(openAngle);
            const oz = -rad - s + s * Math.cos(openAngle);

            const px = THREE.MathUtils.lerp(cx, ox, openVal);
            const py = THREE.MathUtils.lerp(0, 0.01, openVal);
            const pz = THREE.MathUtils.lerp(cz, oz, openVal);

            posAttr.setXYZ(i * 2, px, py, pz);
            posAttr.setXYZ(i * 2 + 1, 0, apexY, apexZ);
          }
          posAttr.needsUpdate = true;
          coneGeo.computeVertexNormals();
          coneGeo.computeBoundingSphere();
        };
        updateConeSurface(currentNetOpen);

        const frame = new THREE.Group();
        const ringGeo = new THREE.TorusGeometry(rad, 0.03, 12, segs);
        ringGeo.rotateX(Math.PI / 2);
        const ring = new THREE.Mesh(ringGeo, edgeMat.clone());
        ring.userData.partId = 'rusuk';
        frame.add(ring);
        clickables.push(ring);
        registerVertex(new THREE.Vector3(0, h, 0), frame);
        shapeGroup.add(frame);

        addDimShaft(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, h, 0));
        addDimShaft(new THREE.Vector3(0, 0.015, 0), new THREE.Vector3(rad, 0.015, 0));

        const sCm = Math.sqrt(dims.r * dims.r + dims.t * dims.t);
        newLabels.push(
          { key: 'r', text: `r = ${dims.r} cm`, pos: new THREE.Vector3(rad * 0.55, 0.14, 0.15), colorClass: 'bg-emerald-700 text-white' },
          { key: 't', text: `t = ${dims.t} cm`, pos: new THREE.Vector3(-0.25, h / 2, 0), colorClass: 'bg-red-600 text-white' },
          { key: 's', text: `s ≈ ${sCm.toFixed(1)} cm`, pos: new THREE.Vector3(rad * 0.55 + 0.15, h * 0.52, 0), colorClass: 'bg-sky-700 text-white' },
        );

        netUpdater = (openVal: number) => {
          updateConeSurface(openVal);
          frame.visible = openVal < 0.04;
        };
      } else if (sid === 'bola') {
        const rad = dims.r * WORLD_SCALE;
        const centerY = rad + 0.02;

        const sphereGeo = new THREE.SphereGeometry(rad, 40, 28);
        const sphereMesh = new THREE.Mesh(sphereGeo, makeFaceMat(0x0ea5e9));
        sphereMesh.position.y = centerY;
        registerFace(sphereMesh, 'sisi', 0x0ea5e9);
        shapeGroup.add(sphereMesh);

        // Equator & meridian rings for clear 3D depth perception
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          roughness: 0.3,
          metalness: 0.2,
        });
        const eqGeo = new THREE.TorusGeometry(rad + 0.01, 0.024, 10, 48);
        eqGeo.rotateX(Math.PI / 2);
        const eqMesh = new THREE.Mesh(eqGeo, ringMat);
        eqMesh.position.y = centerY;
        eqMesh.userData.partId = 'sisi';

        const merGeo = new THREE.TorusGeometry(rad + 0.01, 0.018, 10, 48);
        const merMesh = new THREE.Mesh(merGeo, ringMat.clone());
        merMesh.position.y = centerY;
        merMesh.userData.partId = 'sisi';
        shapeGroup.add(eqMesh, merMesh);

        // Radius rod from center
        addDimShaft(new THREE.Vector3(0, centerY, 0), new THREE.Vector3(rad, centerY, 0));

        // Center dot
        const centerDot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 14), dimMat.clone());
        centerDot.position.set(0, centerY, 0);
        centerDot.userData.partId = 'tinggi';
        shapeGroup.add(centerDot);
        clickables.push(centerDot);

        newLabels.push(
          { key: 'r', text: `r = ${dims.r} cm`, pos: new THREE.Vector3(rad * 0.55, centerY + 0.16, 0), colorClass: 'bg-red-600 text-white' },
          { key: 'd', text: `d = ${(dims.r * 2).toFixed(1)} cm`, pos: new THREE.Vector3(0, centerY - rad - 0.15, 0), colorClass: 'bg-sky-700 text-white' },
        );

        netUpdater = (openVal: number) => {
          // Subtle cutaway slice effect when net slider is moved on sphere
          const scale = 1 - openVal * 0.05;
          sphereMesh.scale.set(scale, scale, scale);
        };
      }

      labelsDataRef.current = newLabels;
      updateHighlights();
      if (!tog.showDimensions) {
        for (let i = 0; i < 4; i++) {
          const el = labelRefs.current[i];
          if (el) el.style.opacity = '0';
        }
      }
      requestRender();
    }

    function applyPreset(preset: CameraPreset) {
      const dims = stateRef.current.dimensions;
      const sid = stateRef.current.shapeId;
      const baseHeight =
        sid === 'bola'
          ? dims.r * WORLD_SCALE
          : (sid === 'kubus' ? dims.p : dims.t) * WORLD_SCALE * 0.5;
      _targetCtrlTarget.set(0, Math.max(0.5, baseHeight), 0);

      const dist = 5.6;
      if (preset === 'iso') _targetCamPos.set(4.5, 3.8, 5.2);
      else if (preset === 'front') _targetCamPos.set(0, baseHeight + 0.4, dist + 1.1);
      else if (preset === 'top') _targetCamPos.set(0.01, dist + 1.8, 0.01);
      else if (preset === 'side') _targetCamPos.set(dist + 1.1, baseHeight + 0.4, 0);

      camTransitionActive = true;
      requestRender();
    }

    engineRef.current = {
      rebuildShape,
      applyPreset,
      requestRender,
      updateHighlights,
    };

    // Initial shape build
    rebuildShape();
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    requestRender();

    // OrbitControls events
    const onControlStart = () => {
      camTransitionActive = false;
    };
    const onControlChange = () => {
      requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    // Click vs drag detection for part raycasting
    let pointerDownPos = { x: 0, y: 0 };
    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e: PointerEvent) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (Math.hypot(dx, dy) > 6) return; // Was a drag/orbit, not a click

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickables, false);
      if (hits.length > 0) {
        const hitObj = hits.find((h) => h.object.visible)?.object;
        const pid = hitObj?.userData?.partId as string | undefined;
        if (pid) {
          onSelectPartRef.current(pid);
          return;
        }
      }
      onSelectPartRef.current(null);
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // Context loss safety
    const onContextLost = (e: Event) => {
      e.preventDefault();
      onWebGLError?.('Konteks grafis 3D terhenti sementara. Muat ulang halaman jika tampilan tidak kembali.');
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    // ResizeObserver for responsive canvas
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    });
    ro.observe(mount);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      disposeObjectTree(shapeGroup);
      floorGeo.dispose();
      floorMat.dispose();
      envTex.dispose();
      renderer.dispose();
      engineRef.current = null;
    };
  }, []);

  // Rebuild shape when shapeId or dimensions change
  useEffect(() => {
    engineRef.current?.rebuildShape();
  }, [shapeId, dimensions.p, dimensions.l, dimensions.t, dimensions.r]);

  // Update visual toggles, net unfolding, and selection highlights without rebuilding scene
  useEffect(() => {
    engineRef.current?.updateHighlights();
  }, [
    toggles.showFaces,
    toggles.showEdges,
    toggles.showVertices,
    toggles.highlightBaseTop,
    toggles.showDimensions,
    toggles.netOpen,
    selectedPart,
  ]);

  // Trigger camera preset transition
  useEffect(() => {
    if (presetVersion > 0) {
      engineRef.current?.applyPreset(cameraPreset);
    }
  }, [cameraPreset, presetVersion]);

  // Compute current dimension labels for rendering in DOM
  const activeLabels: { key: string; text: string; colorClass: string }[] = [];
  if (shapeId === 'kubus') {
    activeLabels.push(
      { key: 'p', text: `s = ${dimensions.p} cm`, colorClass: 'bg-sky-700 text-white' },
      { key: 't', text: `s = ${dimensions.p} cm`, colorClass: 'bg-red-600 text-white' },
    );
  } else if (shapeId === 'balok') {
    activeLabels.push(
      { key: 'p', text: `p = ${dimensions.p} cm`, colorClass: 'bg-sky-700 text-white' },
      { key: 'l', text: `l = ${dimensions.l} cm`, colorClass: 'bg-emerald-700 text-white' },
      { key: 't', text: `t = ${dimensions.t} cm`, colorClass: 'bg-red-600 text-white' },
    );
  } else if (shapeId === 'prisma') {
    activeLabels.push(
      { key: 'p', text: `alas Δ = ${dimensions.p} cm`, colorClass: 'bg-sky-700 text-white' },
      { key: 'l', text: `t Δ = ${dimensions.l} cm`, colorClass: 'bg-red-600 text-white' },
      { key: 't', text: `t prisma = ${dimensions.t} cm`, colorClass: 'bg-emerald-700 text-white' },
    );
  } else if (shapeId === 'limas') {
    activeLabels.push(
      { key: 'p', text: `p = ${dimensions.p} cm`, colorClass: 'bg-sky-700 text-white' },
      { key: 'l', text: `l = ${dimensions.l} cm`, colorClass: 'bg-emerald-700 text-white' },
      { key: 't', text: `t = ${dimensions.t} cm`, colorClass: 'bg-red-600 text-white' },
    );
  } else if (shapeId === 'tabung') {
    activeLabels.push(
      { key: 'r', text: `r = ${dimensions.r} cm`, colorClass: 'bg-emerald-700 text-white' },
      { key: 't', text: `t = ${dimensions.t} cm`, colorClass: 'bg-red-600 text-white' },
    );
  } else if (shapeId === 'kerucut') {
    const sCm = Math.sqrt(dimensions.r * dimensions.r + dimensions.t * dimensions.t);
    activeLabels.push(
      { key: 'r', text: `r = ${dimensions.r} cm`, colorClass: 'bg-emerald-700 text-white' },
      { key: 't', text: `t = ${dimensions.t} cm`, colorClass: 'bg-red-600 text-white' },
      { key: 's', text: `s ≈ ${sCm.toFixed(1)} cm`, colorClass: 'bg-sky-700 text-white' },
    );
  } else if (shapeId === 'bola') {
    activeLabels.push(
      { key: 'r', text: `r = ${dimensions.r} cm`, colorClass: 'bg-red-600 text-white' },
      { key: 'd', text: `d = ${(dimensions.r * 2).toFixed(1)} cm`, colorClass: 'bg-sky-700 text-white' },
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-2xl border border-slate-200 bg-sky-50">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        aria-label={`Objek 3D Interaktif ${shapeId}`}
      />
      {/* Projected semantic 2D dimension labels */}
      {[0, 1, 2, 3].map((idx) => {
        const lbl = activeLabels[idx];
        return (
          <div
            key={idx}
            ref={(el) => {
              labelRefs.current[idx] = el;
            }}
            style={{ opacity: 0, top: 0, left: 0 }}
            className={`pointer-events-none absolute z-10 rounded-md px-2 py-0.5 text-xs font-mono font-semibold shadow-sm transition-opacity duration-150 ${
              lbl ? lbl.colorClass : 'bg-slate-800 text-white'
            }`}
          >
            {lbl ? lbl.text : ''}
          </div>
        );
      })}
    </div>
  );
}
