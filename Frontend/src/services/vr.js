import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';

export class VRService {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.container = container;
    
    this.init();
  }

  init() {
    // Setup renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.xr.enabled = true;
    this.container.appendChild(this.renderer.domElement);
    
    // Add VR button
    this.container.appendChild(VRButton.createButton(this.renderer));
    
    // Setup basic scene
    this.setupLights();
    this.setupControls();
    
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 0);
    this.scene.add(directionalLight);
  }

  setupControls() {
    // Add VR-specific controls here
  }

  loadModel(modelPath) {
    // Implementation for loading 3D models
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
    });
  }
}