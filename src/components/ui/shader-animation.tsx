"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

type Props = {
  speed?: number
  grain?: number
  tint?: string
  className?: string
}

export function ShaderAnimation({
  speed = 0.005,
  grain = 0.04,
  tint = "#8b5cf6",
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: THREE.Camera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    uniforms: {
      time: { value: number }
      resolution: { value: THREE.Vector2 }
      tint: { value: THREE.Vector3 }
      grain: { value: number }
      speed: { value: number }
    }
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const vertexShader = `
      void main() { gl_Position = vec4(position, 1.0); }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec3  tint;
      uniform float grain;
      uniform float speed;

      float hash(vec2 p) {
        p = fract(p*vec2(123.34, 456.21));
        p += dot(p, p+45.32);
        return fract(p.x*p.y);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy*2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * speed;
        float r = length(uv);
        float wave = 0.08 / (abs(sin(4.0*r - t*1.0)) + 0.45);
        float vig = smoothstep(1.4, 0.1, r);
        vec3 base = mix(vec3(0.01, 0.005, 0.02), tint * 0.15, 0.08 + 0.20*vig);
        vec3 aura = tint * wave * 0.20;
        float n = hash(gl_FragCoord.xy + time*30.0) - 0.5;
        vec3 purpleGrain = vec3(n) * grain * vec3(0.6, 0.4, 0.8);
        vec3 color = base + aura + purpleGrain;
        color = clamp(color, 0.0, 1.0);
        gl_FragColor = vec4(color, 1.0);
      }
    `

    const camera = new THREE.Camera()
    camera.position.z = 1
    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)
    const tintColor = new THREE.Color(tint)
    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
      tint: { value: new THREE.Vector3(tintColor.r, tintColor.g, tintColor.b) },
      grain: { value: grain },
      speed: { value: speed },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    const onWindowResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)

    const animate = () => {
      const id = requestAnimationFrame(animate)
      uniforms.time.value += 0.016
      renderer.render(scene, camera)
      if (sceneRef.current) sceneRef.current.animationId = id
    }

    sceneRef.current = { camera, scene, renderer, uniforms, animationId: 0 }
    animate()

    return () => {
      window.removeEventListener("resize", onWindowResize)
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)
        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }
        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [grain, speed, tint])

  return (
    <div
      ref={containerRef}
      className={["w-full h-full", className].filter(Boolean).join(" ")}
      style={{ background: "#0b0613", overflow: "hidden" }}
    />
  )
}
