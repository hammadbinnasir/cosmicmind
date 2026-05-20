"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { GALAXIES, Galaxy } from '@/lib/mockData';
import { Search, Compass, Globe, AlertTriangle, Cpu, RotateCw, ZoomIn, ZoomOut, Eye, Minimize2, Radio } from 'lucide-react';

interface GalaxyMapProps {
  onSelectGalaxy: (galaxy: Galaxy) => void;
  selectedGalaxy: Galaxy | null;
}

export default function GalaxyMap({ onSelectGalaxy, selectedGalaxy }: GalaxyMapProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Layout parameters
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [warpActive, setWarpActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [targetRa, setTargetRa] = useState<string>("");
  const [targetDec, setTargetDec] = useState<string>("");

  // 2D Map State fallback
  const [zoom2D, setZoom2D] = useState<number>(1.2);
  const [distState3D, setDistState3D] = useState<number>(400);
  const [offset2D, setOffset2D] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging2D, setIsDragging2D] = useState<boolean>(false);
  const [dragStart2D, setDragStart2D] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredGalaxy, setHoveredGalaxy] = useState<Galaxy | null>(null);

  // Background stars cache for 2D mode
  const stars2DRef = useRef<Array<{ x: number; y: number; size: number; alpha: number }>>([]);
  useEffect(() => {
    const list = [];
    for (let i = 0; i < 200; i++) {
      list.push({
        x: Math.random() * 2000 - 1000,
        y: Math.random() * 2000 - 1000,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3
      });
    }
    stars2DRef.current = list;
  }, []);

  // Compute combined galaxies list (preset static list + selected custom warp targets)
  const allGalaxies = useMemo(() => {
    const list = [...GALAXIES];
    if (selectedGalaxy && !GALAXIES.some(g => g.id === selectedGalaxy.id)) {
      list.push(selectedGalaxy);
    }
    return list;
  }, [selectedGalaxy]);

  // Three.js instances mapped in refs
  const threeRendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const threeSceneRef = useRef<THREE.Scene | null>(null);
  const threeCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const galaxyGroupsRef = useRef<Map<string, THREE.Group>>(new Map());
  const clickCollidersRef = useRef<THREE.Mesh[]>([]);
  const projectedCoordsRef = useRef<Array<{ id: string; sx: number; sy: number; galaxy: Galaxy }>>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // 3D Orbital variables for camera controls
  const orbitRef = useRef({
    theta: 0.8, // horizontal axis angular offset
    phi: 0.25,   // vertical axis angular offset
    distance: 400,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    destTargetX: 0,
    destTargetY: 0,
    destTargetZ: 0,
    destDistance: 400,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartTheta: 0,
    dragStartPhi: 0,
    isPanning: false,
    dragStartTargetX: 0,
    dragStartTargetY: 0,
  });

  // Track coordinates of selection instantly inside WebGL viewport camera easing
  useEffect(() => {
    if (selectedGalaxy && viewMode === '3d') {
      orbitRef.current.destTargetX = selectedGalaxy.coordinates.x;
      orbitRef.current.destTargetY = selectedGalaxy.coordinates.y;
      orbitRef.current.destTargetZ = selectedGalaxy.coordinates.z;
      orbitRef.current.destDistance = 150; // smooth close-up frame
      setTimeout(() => {
        setDistState3D(150);
      }, 0);
    }
  }, [selectedGalaxy, viewMode]);

  // 1. Interactive 3D WebGL WebGL and Three.js Cycle
  useEffect(() => {
    if (viewMode !== '3d' || typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Allocate WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, Math.max(container.clientHeight, 480));
    threeRendererRef.current = renderer;

    // Create Cosmic Atmosphere Scene
    const scene = new THREE.Scene();
    threeSceneRef.current = scene;

    // Set up camera aspect ratio
    const camera = new THREE.PerspectiveCamera(
      55,
      canvas.width / canvas.height,
      0.1,
      2500
    );
    threeCameraRef.current = camera;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(200, 300, 100);
    scene.add(keyLight);

    // 3D Grid floor (like standard Declination sheet)
    let gridHelper: THREE.GridHelper | null = null;
    if (showGrid) {
      gridHelper = new THREE.GridHelper(800, 32, '#06b6d4', 'rgba(6,182,212,0.12)');
      gridHelper.position.y = -60;
      scene.add(gridHelper);
    }

    // Stellar starfield particle generator (faint background depth)
    const starCount = 1800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 1600;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 1600;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 1600;

      const r = Math.random();
      if (r < 0.35) {
        starColors[i * 3] = 0.6; // Soft neon light projection
        starColors[i * 3 + 1] = 0.85;
        starColors[i * 3 + 2] = 1.0;
      } else if (r < 0.6) {
        starColors[i * 3] = 0.9; // Amber flare
        starColors[i * 3 + 1] = 0.7;
        starColors[i * 3 + 2] = 1.0;
      } else {
        starColors[i * 3] = 1.0; // Clean white
        starColors[i * 3 + 1] = 1.0;
        starColors[i * 3 + 2] = 1.0;
      }
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    // Custom Canvas round circle texture mapping for beautiful anti-aliased dot star shapes
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 16;
    starCanvas.height = 16;
    const sCtx = starCanvas.getContext('2d');
    if (sCtx) {
      const g = sCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.35, 'rgba(255, 255, 255, 0.75)');
      g.addColorStop(1, 'transparent');
      sCtx.fillStyle = g;
      sCtx.fillRect(0, 0, 16, 16);
    }
    const dotTexture = new THREE.CanvasTexture(starCanvas);

    const starMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      map: dotTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.9,
      depthWrite: false
    });
    const starParticles = new THREE.Points(starGeo, starMat);
    scene.add(starParticles);

    // Cosmic network lines (Filament connection vectors matching deep space architecture)
    let filamentLines: THREE.LineSegments | null = null;
    if (showGrid) {
      const lineGeo = new THREE.BufferGeometry();
      const linePos: number[] = [];
      const lineCols: number[] = [];

      allGalaxies.forEach((g1, i) => {
        allGalaxies.forEach((g2, j) => {
          if (i >= j) return;
          const distance = Math.hypot(
            g1.coordinates.x - g2.coordinates.x,
            g1.coordinates.y - g2.coordinates.y,
            g1.coordinates.z - g2.coordinates.z
          );

          if (distance < 380) {
            linePos.push(g1.coordinates.x, g1.coordinates.y, g1.coordinates.z);
            linePos.push(g2.coordinates.x, g2.coordinates.y, g2.coordinates.z);

            const c1 = new THREE.Color(g1.color);
            const c2 = new THREE.Color(g2.color);
            lineCols.push(c1.r, c1.g, c1.b);
            lineCols.push(c2.r, c2.g, c2.b);
          }
        });
      });

      if (linePos.length > 0) {
        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
        lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineCols, 3));
        const lineMat = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: 0.12,
          blending: THREE.AdditiveBlending
        });
        filamentLines = new THREE.LineSegments(lineGeo, lineMat);
        scene.add(filamentLines);
      }
    }

    // Build unique rotating galaxy structures
    const groupsMap = new Map<string, THREE.Group>();
    const clickColliders: THREE.Mesh[] = [];

    allGalaxies.forEach(galaxy => {
      // Container group
      const gGroup = new THREE.Group();
      gGroup.position.set(galaxy.coordinates.x, galaxy.coordinates.y, galaxy.coordinates.z);
      scene.add(gGroup);
      groupsMap.set(galaxy.id, gGroup);

      // Core physical glowing node
      const coreGeo = new THREE.SphereGeometry(3.2, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: galaxy.color,
        transparent: true,
        opacity: 0.9
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      gGroup.add(core);

      // Accreting halo glow ring
      const haloGeo = new THREE.RingGeometry(3.6, 6.5, 30);
      const haloMat = new THREE.MeshBasicMaterial({
        color: galaxy.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 2;
      gGroup.add(halo);

      // Star point cloud inside the individual galaxy disk (Differentiated based on Classification)
      const count = galaxy.type === 'Spiral' ? 550 : galaxy.type === 'Active Galactic Nucleus (AGN)' ? 400 : 300;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const baseColor = new THREE.Color(galaxy.color);

      for (let i = 0; i < count; i++) {
        if (galaxy.type === 'Spiral') {
          // Logarithmic dual arms spiral shape math
          const armOffset = i % 2 === 0 ? 0 : Math.PI;
          const progress = i / count;
          const theta = progress * 14.5 + armOffset;
          const radius = 5 + progress * 24 + (Math.random() * 4 - 2);
          positions[i * 3] = radius * Math.cos(theta);
          positions[i * 3 + 1] = (Math.random() * 2.5 - 1.25) * (1 - progress * 0.8);
          positions[i * 3 + 2] = radius * Math.sin(theta);
        } else if (galaxy.type === 'Active Galactic Nucleus (AGN)') {
          // Relativistic jet streaming along Y axis
          if (i < 130) {
            // Highly dense sphere center
            const rad = Math.random() * 7;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            positions[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = rad * Math.cos(phi);
          } else {
            // Bi-polar jet coordinates flowing outwards
            const t = Math.random();
            const sign = i % 2 === 0 ? 1 : -1;
            positions[i * 3] = (Math.random() * 1.8 - 0.9) * t;
            positions[i * 3 + 1] = sign * (6 + t * 44);
            positions[i * 3 + 2] = (Math.random() * 1.8 - 0.9) * t;
          }
        } else if (galaxy.type === 'Lenticular' || galaxy.type === 'Elliptical') {
          // Smooth round dense ellipsoidal distribution (thick disc)
          const rad = Math.random() * 20;
          const theta = Math.random() * Math.PI * 2;
          const factor = Math.random() * 0.45 + 0.15; // flatter height
          positions[i * 3] = rad * Math.cos(theta);
          positions[i * 3 + 1] = (Math.random() * 8 - 4) * (1 - rad / 25) * factor;
          positions[i * 3 + 2] = rad * Math.sin(theta);
        } else {
          // Irregular clumps (chaotic clouds)
          const rad = 4 + Math.random() * 22;
          const rTheta = Math.random() * Math.PI * 2;
          positions[i * 3] = rad * Math.cos(rTheta) + (Math.random() * 6 - 3);
          positions[i * 3 + 1] = Math.random() * 10 - 5;
          positions[i * 3 + 2] = rad * Math.sin(rTheta) + (Math.random() * 6 - 3);
        }

        // Color brightness depending on center radius
        const distToCenter = Math.hypot(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        const fade = Math.max(0.3, 1.0 - distToCenter / 45);
        colors[i * 3] = baseColor.r * (fade + 0.3);
        colors[i * 3 + 1] = baseColor.g * (fade + 0.3);
        colors[i * 3 + 2] = baseColor.b * (fade + 0.3);
      }

      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 1.45,
        vertexColors: true,
        map: dotTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.9,
        depthWrite: false
      });

      const pointCloud = new THREE.Points(pGeo, particleMat);
      gGroup.add(pointCloud);

      // Invisible touch/click collider sphere mesh (high radius for easy click interactions)
      const collGeo = new THREE.SphereGeometry(24, 8, 8);
      const collMat = new THREE.MeshBasicMaterial({ visible: false, transparent: true, opacity: 0 });
      const collMesh = new THREE.Mesh(collGeo, collMat);
      collMesh.position.set(galaxy.coordinates.x, galaxy.coordinates.y, galaxy.coordinates.z);
      collMesh.userData = { id: galaxy.id, galaxy };
      scene.add(collMesh);
      clickColliders.push(collMesh);
    });

    galaxyGroupsRef.current = groupsMap;
    clickCollidersRef.current = clickColliders;

    // Rescale helper function
    const handleResize = () => {
      if (!canvas || !container || !threeCameraRef.current || !threeRendererRef.current) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 480);
      threeCameraRef.current.aspect = w / h;
      threeCameraRef.current.updateProjectionMatrix();
      threeRendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 2. MAIN 3D WEBGL RENDERING LOOP
    let spinPhase = 0;
    const render = () => {
      const o = orbitRef.current;

      // Smooth mechanical interpolation (Target & zoom easing)
      o.targetX += (o.destTargetX - o.targetX) * 0.075;
      o.targetY += (o.destTargetY - o.targetY) * 0.075;
      o.targetZ += (o.destTargetZ - o.targetZ) * 0.075;
      o.distance += (o.destDistance - o.distance) * 0.075;

      // Smooth continuous auto-rotation of the telescope array angle
      spinPhase += 0.0012;
      let activeTheta = o.theta;
      let activePhi = o.phi;

      // Handle hyper warp speed visual effects
      if (warpActive) {
        // Boost theta rotation quickly, creating stretch streaks
        o.theta += 0.025;
        starMat.size = 6 + Math.sin(Date.now() * 0.01) * 3;
        starMat.opacity = 0.5 + Math.random() * 0.4;
        o.distance += (100 - o.distance) * 0.12; // Hyper zoom-in acceleration
      } else {
        starMat.size = 1.8;
        starMat.opacity = 0.9;
      }

      // Bound vertical polar angle to prevent flips
      const clampedPhi = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, activePhi));

      // Coordinate projections (converting 3D vectors to screen coordinates for responsive CSS tagging)
      camera.position.x = o.targetX + o.distance * Math.sin(activeTheta) * Math.cos(clampedPhi);
      camera.position.y = o.targetY + o.distance * Math.sin(clampedPhi);
      camera.position.z = o.targetZ + o.distance * Math.cos(activeTheta) * Math.cos(clampedPhi);
      camera.lookAt(o.targetX, o.targetY, o.targetZ);

      // Rotate galaxy orbits in physical simulation
      groupsMap.forEach((gGroup, id) => {
        // Individual rotations
        const isSelected = selectedGalaxy?.id === id;
        
        // Galaxies rotate at organic speed ratios
        if (id === 'gal-001') {
          gGroup.rotation.y -= 0.004; // Jets rotating
        } else {
          gGroup.rotation.y += 0.003;
        }

        if (isSelected) {
          const pulsate = 1.0 + Math.sin(Date.now() * 0.005) * 0.08;
          gGroup.scale.set(pulsate, pulsate, pulsate);
        } else {
          gGroup.scale.set(1.0, 1.0, 1.0);
        }
      });

      // Slowly rotate overall starfield background for parallax feel
      starParticles.rotation.y -= 0.0004;
      starParticles.rotation.x += 0.0001;

      // Render Three Scene
      renderer.render(scene, camera);

      // Project galaxy positions onto standard canvas coordinates mapping (sx, sy)
      const screenCoordsList: Array<{ id: string; sx: number; sy: number; galaxy: Galaxy }> = [];
      allGalaxies.forEach(galaxy => {
        const v = new THREE.Vector3(galaxy.coordinates.x, galaxy.coordinates.y, galaxy.coordinates.z);
        v.project(camera);
        const screenX = (v.x * 0.5 + 0.5) * canvas.width;
        const screenY = (-v.y * 0.5 + 0.5) * canvas.height;
        screenCoordsList.push({ id: galaxy.id, sx: screenX, sy: screenY, galaxy });
      });
      projectedCoordsRef.current = screenCoordsList;

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    // Clean up all resources correctly on unmount to prevent rendering context leaks
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      
      // Dispose materials & geometries
      starGeo.dispose();
      starMat.dispose();
      dotTexture.dispose();
      if (gridHelper) scene.remove(gridHelper);
      if (filamentLines) {
        filamentLines.geometry.dispose();
        if (Array.isArray(filamentLines.material)) {
          filamentLines.material.forEach(m => m.dispose());
        } else {
          filamentLines.material.dispose();
        }
      }

      groupsMap.forEach(gr => {
        gr.traverse(node => {
          if (node instanceof THREE.Mesh) {
            node.geometry.dispose();
            if (Array.isArray(node.material)) {
              node.material.forEach(m => m.dispose());
            } else {
              node.material.dispose();
            }
          } else if (node instanceof THREE.Points) {
            node.geometry.dispose();
            (node.material as THREE.Material).dispose();
          }
        });
      });

      clickColliders.forEach(coll => {
        coll.geometry.dispose();
        (coll.material as THREE.Material).dispose();
      });

      renderer.dispose();
    };
  }, [viewMode, allGalaxies, showGrid, warpActive, selectedGalaxy]);

  // 3. Fallback 2D Render Loop
  useEffect(() => {
    if (viewMode !== '2d') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render2D = () => {
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2 + offset2D.x;
      const centerY = canvas.height / 2 + offset2D.y;

      // Grid helper lines
      if (showGrid) {
        ctx.strokeStyle = "rgba(6, 182, 212, 0.09)";
        ctx.lineWidth = 1;
        const spacing = 80 * zoom2D;

        const left = -centerX;
        const right = canvas.width - centerX;
        const startX = Math.floor(left / spacing) * spacing;
        for (let x = startX; x < right; x += spacing) {
          ctx.beginPath();
          ctx.moveTo(centerX + x, 0);
          ctx.lineTo(centerX + x, canvas.height);
          ctx.stroke();

          ctx.fillStyle = "rgba(148, 163, 184, 0.2)";
          ctx.font = "8px monospace";
          const hour = Math.floor((x + 1000) / 100) % 24;
          ctx.fillText(`${hour}h 00m`, centerX + x + 4, canvas.height - 10);
        }

        const top = -centerY;
        const bottom = canvas.height - centerY;
        const startY = Math.floor(top / spacing) * spacing;
        for (let y = startY; y < bottom; y += spacing) {
          ctx.beginPath();
          ctx.moveTo(0, centerY + y);
          ctx.lineTo(canvas.width, centerY + y);
          ctx.stroke();

          ctx.fillStyle = "rgba(148, 163, 184, 0.2)";
          ctx.font = "8px monospace";
          const deg = Math.floor((y + 1000) / 10) % 90;
          ctx.fillText(`+${deg}° 00'`, 10, centerY + y - 4);
        }
      }

      // Draw background flat stars
      ctx.fillStyle = "#ffffff";
      stars2DRef.current.forEach(star => {
        const sx = centerX + star.x * zoom2D;
        const sy = centerY + star.y * zoom2D;
        if (sx >= 0 && sx <= canvas.width && sy >= 0 && sy <= canvas.height) {
          ctx.globalAlpha = star.alpha * (0.35 + zoom2D * 0.1);
          ctx.fillRect(sx, sy, star.size, star.size);
        }
      });
      ctx.globalAlpha = 1.0;

      // Draw active galaxies
      allGalaxies.forEach(galaxy => {
        const gx = centerX + galaxy.coordinates.x * zoom2D * 2.1;
        const gy = centerY + galaxy.coordinates.y * zoom2D * 2.1;

        const isSelected = selectedGalaxy?.id === galaxy.id;
        const isHovered = hoveredGalaxy?.id === galaxy.id;

        const rad = isSelected ? 24 : isHovered ? 17 : 9;
        const viewRad = rad * Math.max(0.6, zoom2D * 0.5);

        // Core bloom
        const g = ctx.createRadialGradient(gx, gy, 1, gx, gy, viewRad * 4);
        g.addColorStop(0, galaxy.color);
        g.addColorStop(0.3, `${galaxy.color}35`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(gx, gy, viewRad * 4, 0, Math.PI * 2);
        ctx.fill();

        // White nucleus node
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(gx, gy, Math.max(2.2, viewRad * 0.45), 0, Math.PI * 2);
        ctx.fill();

        if (isSelected) {
          ctx.strokeStyle = "#06b6d4";
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(gx, gy, viewRad * 2.4, 0, Math.PI * 2);
          ctx.stroke();

          // Crosshair lines
          ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(gx - viewRad * 3.8, gy);
          ctx.lineTo(gx - viewRad * 1.6, gy);
          ctx.moveTo(gx + viewRad * 1.6, gy);
          ctx.lineTo(gx + viewRad * 3.8, gy);
          ctx.moveTo(gx, gy - viewRad * 3.8);
          ctx.lineTo(gx, gy - viewRad * 1.6);
          ctx.moveTo(gx, gy + viewRad * 1.6);
          ctx.lineTo(gx, gy + viewRad * 3.8);
          ctx.stroke();

          // Labels
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 11px var(--font-sans)";
          ctx.fillText(`[ ${galaxy.name} ]`, gx + viewRad * 2.7, gy - 8);
          ctx.fillStyle = galaxy.color;
          ctx.font = "8px var(--font-mono)";
          ctx.fillText(`${galaxy.type} | z=${galaxy.redshift.toFixed(4)}`, gx + viewRad * 2.7, gy + 5);
        } else if (isHovered) {
          ctx.fillStyle = "#f5f5f7";
          ctx.font = "10px var(--font-sans)";
          ctx.fillText(galaxy.name, gx + viewRad * 2.2, gy - 6);
          ctx.fillStyle = "rgba(245, 245, 247, 0.5)";
          ctx.font = "7px var(--font-mono)";
          ctx.fillText(`RA ${galaxy.ra}`, gx + viewRad * 2.2, gy + 4);
        }
      });

      animId = requestAnimationFrame(render2D);
    };

    render2D();
    return () => cancelAnimationFrame(animId);
  }, [viewMode, offset2D, zoom2D, hoveredGalaxy, selectedGalaxy, showGrid, allGalaxies]);

  // Handle Drag / Pan controls for both 2D and 3D scenes
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (viewMode === '3d') {
      const o = orbitRef.current;
      if (e.shiftKey || e.button === 2) {
        // Panning mode (Shift + Left Drag, or Right Drag)
        o.isPanning = true;
        o.dragStartX = e.clientX;
        o.dragStartY = e.clientY;
        o.dragStartTargetX = o.destTargetX;
        o.dragStartTargetY = o.destTargetY;
      } else {
        // Orbit rotating mode
        o.isDragging = true;
        o.dragStartX = e.clientX;
        o.dragStartY = e.clientY;
        o.dragStartTheta = o.theta;
        o.dragStartPhi = o.phi;
      }
    } else {
      setIsDragging2D(true);
      setDragStart2D({ x: e.clientX - offset2D.x, y: e.clientY - offset2D.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (viewMode === '3d') {
      const o = orbitRef.current;
      if (o.isDragging) {
        // Calculate rotational changes
        const dx = e.clientX - o.dragStartX;
        const dy = e.clientY - o.dragStartY;
        o.theta = o.dragStartTheta - dx * 0.007;
        o.phi = o.dragStartPhi - dy * 0.007;

        // Constraint vertical focus
        o.phi = Math.max(-Math.PI / 2.4, Math.min(Math.PI / 2.4, o.phi));
      } else if (o.isPanning) {
        const dx = e.clientX - o.dragStartX;
        const dy = e.clientY - o.dragStartY;
        // Move coordinates targeting factor depending on camera rotation tangent plane
        o.destTargetX = o.dragStartTargetX - dx * 0.6 * Math.cos(o.theta);
        o.destTargetZ = o.dragStartTargetY + dx * 0.6 * Math.sin(o.theta);
        o.destTargetY = o.dragStartTargetY + dy * 0.6;
      } else {
        // Live 3D hit test calculation (Projected 2D screen distance test)
        let found: Galaxy | null = null;
        projectedCoordsRef.current.forEach(item => {
          const dist = Math.hypot(mouseX - item.sx, mouseY - item.sy);
          if (dist < 26) {
            found = item.galaxy;
          }
        });
        setHoveredGalaxy(found);
      }
    } else {
      if (isDragging2D) {
        setOffset2D({
          x: e.clientX - dragStart2D.x,
          y: e.clientY - dragStart2D.y
        });
      } else {
        const centerX = canvas.width / 2 + offset2D.x;
        const centerY = canvas.height / 2 + offset2D.y;
        let found: Galaxy | null = null;

        allGalaxies.forEach(galaxy => {
          const gx = centerX + galaxy.coordinates.x * zoom2D * 2.1;
          const gy = centerY + galaxy.coordinates.y * zoom2D * 2.1;
          const dist = Math.hypot(mouseX - gx, mouseY - gy);

          if (dist < 26) {
            found = galaxy;
          }
        });
        setHoveredGalaxy(found);
      }
    }
  };

  const handleMouseUp = () => {
    const o = orbitRef.current;
    o.isDragging = false;
    o.isPanning = false;
    setIsDragging2D(false);
  };

  // Prevent right-click context menu popping over coordinates layout
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredGalaxy) {
      onSelectGalaxy(hoveredGalaxy);
      if (viewMode === '3d') {
        // Center the 3D scene camera at selected coords
        orbitRef.current.destTargetX = hoveredGalaxy.coordinates.x;
        orbitRef.current.destTargetY = hoveredGalaxy.coordinates.y;
        orbitRef.current.destTargetZ = hoveredGalaxy.coordinates.z;
        orbitRef.current.destDistance = 140;
        setDistState3D(140);
      } else {
        // Center 2D
        setOffset2D({
          x: -(hoveredGalaxy.coordinates.x * zoom2D * 2.1),
          y: -(hoveredGalaxy.coordinates.y * zoom2D * 2.1)
        });
      }
    }
  };

  // Mouse Wheel scroll Zoom hooks
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (viewMode === '3d') {
      const o = orbitRef.current;
      const targetDist = Math.max(70, Math.min(850, o.destDistance + e.deltaY * 0.45));
      o.destDistance = targetDist;
      setDistState3D(Math.round(targetDist));
    } else {
      setZoom2D(prev => Math.max(0.4, Math.min(3.5, prev - e.deltaY * 0.001)));
    }
  };

  // Warp coordination sweep trigger
  const handleCoordinateWarp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRa && !targetDec) return;

    setWarpActive(true);
    setTimeout(() => {
      const randomX = Math.floor(Math.random() * 240 - 120);
      const randomY = Math.floor(Math.random() * 100 - 50);
      const randomZ = Math.floor(Math.random() * 240 - 120);

      // Settle targets
      if (viewMode === '3d') {
        orbitRef.current.destTargetX = randomX;
        orbitRef.current.destTargetY = randomY;
        orbitRef.current.destTargetZ = randomZ;
        orbitRef.current.destDistance = 120;
        setDistState3D(120);
      } else {
        setOffset2D({ x: -randomX * 1.5, y: -randomY * 1.5 });
        setZoom2D(1.6);
      }
      setWarpActive(false);

      // Spawn virtual specimen at targeted coordinate field
      const customWarpedGalaxy: Galaxy = {
        id: `warp-${Date.now()}`,
        name: `Epoch-GR-${Math.floor(Math.random() * 9000 + 1000)}`,
        type: Math.random() > 0.6 ? "Unknown Anomaly" : "Lenticular",
        constellation: "Ursa Major Offset",
        distance: "4,600 Mly",
        ra: targetRa || "14h 22m 11s",
        dec: targetDec || "+19° 55' 03\"",
        redshift: 2.450 + Math.random() * 0.5,
        anomalyScore: Math.floor(Math.random() * 40 + 55),
        status: "Critical Anomaly",
        spectralData: [20, 60, 110, 180, 240, 310, 480, 720, 910, 760, 420, 215],
        description: `Gravitational warp target designated at Right Ascension ${targetRa || "14h 22m"} / Declination ${targetDec || "+19° 55'"}. Deep-sky sensor modules registered severe magnetic shear coinciding with intense relativistic emissions.`,
        color: Math.random() > 0.5 ? "#ec4899" : "#a855f7",
        coordinates: { x: randomX, y: randomY, z: randomZ }
      };

      onSelectGalaxy(customWarpedGalaxy);
    }, 1400);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return;

    const matched = allGalaxies.find(g => g.name.toLowerCase().includes(query) || g.type.toLowerCase().includes(query));
    if (matched) {
      onSelectGalaxy(matched);
      if (viewMode === '3d') {
        orbitRef.current.destTargetX = matched.coordinates.x;
        orbitRef.current.destTargetY = matched.coordinates.y;
        orbitRef.current.destTargetZ = matched.coordinates.z;
        orbitRef.current.destDistance = 130;
        setDistState3D(130);
      } else {
        setOffset2D({
          x: -(matched.coordinates.x * zoom2D * 2.1),
          y: -(matched.coordinates.y * zoom2D * 2.1)
        });
        setZoom2D(1.5);
      }
    }
  };

  const resetViewport = () => {
    if (viewMode === '3d') {
      orbitRef.current.destTargetX = 0;
      orbitRef.current.destTargetY = 0;
      orbitRef.current.destTargetZ = 0;
      orbitRef.current.destDistance = 380;
      orbitRef.current.theta = 0.8;
      orbitRef.current.phi = 0.25;
      setDistState3D(380);
    } else {
      setOffset2D({ x: 0, y: 0 });
      setZoom2D(1.2);
    }
  };

  // Orbit control panels (tactile screen controllers)
  const adjustOrbit = (direction: 'left' | 'right' | 'up' | 'down') => {
    const o = orbitRef.current;
    if (direction === 'left') o.theta += 0.2;
    if (direction === 'right') o.theta -= 0.2;
    if (direction === 'up') o.phi = Math.min(Math.PI / 2.3, o.phi + 0.15);
    if (direction === 'down') o.phi = Math.max(-Math.PI / 2.3, o.phi - 0.15);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full" id="galaxy-explorer-container">
      
      {/* interactive 3D WebGL simulator / 2D fallback HUD container */}
      <div className="lg:col-span-3 flex flex-col bg-black/40 border border-white/10 rounded-3xl relative overflow-hidden backdrop-blur-sm shadow-2xl" ref={containerRef}>
        
        {/* Top telemetry bar */}
        <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent z-10 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '7s' }} />
            <div>
              <h3 className="font-sans font-medium text-xs text-white tracking-wider uppercase flex items-center gap-1.5">
                DEEP SPACE HUBBLE SURVEY 
                <span className="text-[9px] text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded uppercase font-mono">
                  {viewMode === '3d' ? '3D WebGL' : '2D Survey Map'}
                </span>
              </h3>
              <p className="text-[9px] font-mono text-cyan-400/80 uppercase">AUTOMATED TELESCOPE LENSING TRACKING</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex bg-black/50 rounded-xl border border-white/10 overflow-hidden p-0.5 text-[10px] font-mono mr-1">
              <button
                onClick={() => setViewMode('3d')}
                className={`px-2.5 py-1 rounded-lg transition-all ${viewMode === '3d' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/10' : 'text-slate-400 hover:text-white'}`}
                id="toggle-3d-view"
              >
                3D SIMULATOR
              </button>
              <button
                onClick={() => setViewMode('2d')}
                className={`px-2.5 py-1 rounded-lg transition-all ${viewMode === '2d' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/10' : 'text-slate-400 hover:text-white'}`}
                id="toggle-2d-view"
              >
                2D MAP
              </button>
            </div>

            <button 
              onClick={() => setShowGrid(!showGrid)} 
              className={`px-2.5 py-1 text-[10px] font-mono rounded-xl border border-white/10 transition-colors ${showGrid ? 'bg-cyan-500/15 text-cyan-300' : 'text-gray-400 hover:bg-white/5'}`}
              id="grid-toggle"
            >
              GRID: {showGrid ? "ACTIVE" : "HIDDEN"}
            </button>
            <button 
              onClick={resetViewport} 
              className="px-2.5 py-1 text-[10px] font-mono text-zinc-300 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
              id="reset-view"
            >
              RESET
            </button>
          </div>
        </div>

        {/* The WebGL & fallback Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onContextMenu={handleContextMenu}
          onClick={handleCanvasClick}
          className="cursor-crosshair w-full block bg-[#030306]"
          style={{ height: '480px' }}
          id="galaxy-star-canvas"
        />

        {/* 3D Orbit & Pan interactive cockpit overlay helper */}
        <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2 p-3.5 bg-black/85 backdrop-blur-md rounded-2xl border border-white/10 max-w-xs shadow-2xl">
          <p className="text-[10px] font-mono text-slate-400 tracking-wider">TELESCOPE CAMERA STEERING</p>
          
          <div className="flex items-center gap-1.5">
            <div className="grid grid-cols-3 gap-1 shrink-0 bg-white/5 p-1 rounded-xl">
              <div></div>
              <button 
                onClick={() => adjustOrbit('up')}
                className="w-6 h-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded flex items-center justify-center text-xs active:scale-90 font-bold"
                title="Orbit pitch up"
              >
                ▲
              </button>
              <div></div>
              <button 
                onClick={() => adjustOrbit('left')}
                className="w-6 h-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded flex items-center justify-center text-xs active:scale-90 font-bold"
                title="Orbit yaw left"
              >
                ◀
              </button>
              <button 
                onClick={resetViewport}
                className="w-6 h-6 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/20 text-cyan-300 rounded flex items-center justify-center text-[9px]"
                title="Center"
              >
                ■
              </button>
              <button 
                onClick={() => adjustOrbit('right')}
                className="w-6 h-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded flex items-center justify-center text-xs active:scale-90 font-bold"
                title="Orbit yaw right"
              >
                ▶
              </button>
              <div></div>
              <button 
                onClick={() => adjustOrbit('down')}
                className="w-6 h-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded flex items-center justify-center text-xs active:scale-90 font-bold"
                title="Orbit pitch down"
              >
                ▼
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-between h-full pl-2 gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (viewMode === '3d') {
                      const newDist = Math.max(70, orbitRef.current.destDistance - 50);
                      orbitRef.current.destDistance = newDist;
                      setDistState3D(Math.round(newDist));
                    } else {
                      setZoom2D(z => Math.min(3.5, z + 0.2));
                    }
                  }}
                  className="w-7 h-7 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg flex items-center justify-center text-white active:scale-90"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (viewMode === '3d') {
                      const newDist = Math.min(850, orbitRef.current.destDistance + 50);
                      orbitRef.current.destDistance = newDist;
                      setDistState3D(Math.round(newDist));
                    } else {
                      setZoom2D(z => Math.max(0.4, z - 0.2));
                    }
                  }}
                  className="w-7 h-7 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg flex items-center justify-center text-white active:scale-90"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[9px] font-mono text-cyan-400">
                {viewMode === '3d' ? `DIST: ${Math.round(distState3D)}ly` : `ZOOM: ${(zoom2D * 100).toFixed(0)}%`}
              </span>
            </div>
          </div>
          
          <div className="text-[9px] font-sans text-slate-400 space-y-1">
            <p>• Drag to spin satellite viewpoint.</p>
            <p>• Right-Click / Shift+Drag to pan targets.</p>
            <p>• Scroll wheel or trackpad to zoom.</p>
          </div>
        </div>

        {/* Dynamic Search & Coordinate Targeter Hud */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col sm:flex-row gap-2 max-w-lg">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="flex bg-black/85 rounded-xl border border-white/10 overflow-hidden shadow-2xl text-[11px] backdrop-blur-md">
            <input
              type="text"
              placeholder="Search catalog pres..."
              className="bg-transparent px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none w-36 uppercase-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="map-search-input"
            />
            <button type="submit" className="p-1 px-3 bg-cyan-500/10 text-cyan-400 border-l border-white/10 hover:bg-cyan-500/20 transition-colors" id="map-search-btn">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* RA / DEC Targeter Form */}
          <form onSubmit={handleCoordinateWarp} className="flex bg-black/85 rounded-xl border border-white/10 overflow-hidden shadow-2xl text-xs backdrop-blur-md">
            <input
              type="text"
              placeholder="RA 13h25m"
              className="bg-transparent px-2.5 py-1.5 text-white placeholder-gray-500 font-mono focus:outline-none w-20 border-r border-white/10"
              value={targetRa}
              onChange={(e) => setTargetRa(e.target.value)}
              id="warp-ra-input"
            />
            <input
              type="text"
              placeholder="DEC -33°42"
              className="bg-transparent px-2.5 py-1.5 text-white placeholder-gray-500 font-mono focus:outline-none w-20 border-r border-white/10"
              value={targetDec}
              onChange={(e) => setTargetDec(e.target.value)}
              id="warp-dec-input"
            />
            <button 
              type="submit" 
              className={`px-3 bg-cyan-500/15 text-cyan-300 font-mono uppercase tracking-wider text-[10px] hover:bg-cyan-500/25 transition-colors font-bold ${warpActive ? 'animate-pulse' : ''}`}
              id="coordinate-warp-btn"
            >
              {warpActive ? "WARPING..." : "WARP"}
            </button>
          </form>
        </div>
      </div>

      {/* Astro-Metrical Survey Panel */}
      <div className="flex flex-col bg-white/5 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/10 p-5 divide-y divide-white/10 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h3 className="font-sans font-semibold text-xs text-white tracking-widest uppercase">CATALOGED SPECIMEN METADATA</h3>
          </div>

          {!selectedGalaxy ? (
            <div className="text-center py-12 text-zinc-500 font-sans">
              <Compass className="w-10 h-10 mx-auto text-zinc-700 mb-3 stroke-[1]" />
              <p className="text-xs">No active specimen is locked in target HUD.</p>
              <p className="text-[9px] font-mono text-zinc-600 mt-2">CLICK ANY CELESTIAL EMITTER IN THE interactive 3D WebGL simulator TO SWEEP ANOMALY PARAMETERS</p>
            </div>
          ) : (
            <div className="space-y-4 pt-1 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-sans font-bold text-sm text-white mb-0.5">{selectedGalaxy.name}</h4>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 py-0.5 px-2 rounded-lg">{selectedGalaxy.id}</span>
                </div>
                <div className={`p-1 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase border ${
                  selectedGalaxy.anomalyScore > 80 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  selectedGalaxy.anomalyScore > 40 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {selectedGalaxy.status}
                </div>
              </div>

              <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
                <p className="text-[11px] font-sans text-slate-400 leading-relaxed italic">
                  &ldquo;{selectedGalaxy.description}&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="block text-slate-500 text-[8px] uppercase">GALAXY TYPE</span>
                  <span className="text-white text-[11px] font-semibold">{selectedGalaxy.type}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="block text-slate-500 text-[8px] uppercase">REDSHIFT (z)</span>
                  <span className="text-cyan-400 text-[11px] font-bold">{selectedGalaxy.redshift.toFixed(5)}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="block text-slate-500 text-[8px] uppercase">RIGHT ASCENSION</span>
                  <span className="text-white text-[11px]">{selectedGalaxy.ra}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="block text-slate-500 text-[8px] uppercase">DECLINATION</span>
                  <span className="text-white text-[11px]">{selectedGalaxy.dec}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl col-span-2">
                  <span className="block text-slate-500 text-[8px] uppercase">DISTANCE FROM LOCAL CLUSTER</span>
                  <span className="text-white text-[11px]">{selectedGalaxy.distance} (~{selectedGalaxy.distance.includes('Million') || selectedGalaxy.distance.includes('Mly') ? (parseFloat(selectedGalaxy.distance) * 9.46).toFixed(1) : '24.1'} Trillion Km)</span>
                </div>
              </div>

              {/* Spectral mini bar-indicator */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between font-mono text-[9.5px]">
                  <span className="text-slate-400">ANOMALY INDEX CORRELATION</span>
                  <span className="text-rose-400 font-bold">{selectedGalaxy.anomalyScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-400 rounded-full transition-all duration-500"
                    style={{ width: `${selectedGalaxy.anomalyScore}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected Galaxy Live Accretion Speed chart mockup using CSS bars */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
            <span>MULTI-BAND RADIATIVE SPECTRA</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              CO-ADDS FITTED
            </span>
          </div>
          {selectedGalaxy ? (
            <div className="h-16 flex items-end justify-between gap-1 px-1 bg-black/40 rounded-2xl border border-white/5 pt-3">
              {selectedGalaxy.spectralData.map((val, idx) => {
                const heightPercentage = Math.min(100, Math.max(15, (val / 1000) * 100));
                return (
                  <div 
                    key={idx} 
                    className="flex-1 rounded-t bg-gradient-to-t from-cyan-500/20 to-cyan-400 opacity-80 hover:opacity-100 transition-all cursor-crosshair group relative"
                    style={{ height: `${heightPercentage}%` }}
                    title={`Ch ${idx + 1}: ${val} Jy`}
                  >
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-black text-white text-[8px] font-mono p-1 rounded whitespace-nowrap border border-white/10 pointer-events-none z-20">
                      {val} Jy
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-16 flex items-center justify-center bg-black/40 rounded-2xl border border-white/5 text-[9px] font-mono text-zinc-500 uppercase">
              Awaiting target spectral sweep
            </div>
          )}
          <div className="text-[8px] font-mono text-zinc-500 flex justify-between uppercase tracking-wider">
            <span>150 GHz</span>
            <span>420 THz (Inf)</span>
            <span>900 PHz (UV)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
