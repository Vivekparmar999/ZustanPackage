import { Vector3, CatmullRomCurve3 } from 'three'
import React, { useRef, useMemo } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import * as meshline from 'meshline'

extend(meshline)

//Random number between 0.2 to 1 
const r = () => Math.max(0.2, Math.random())

function Fatline({ curve, width, color }) {
  //declared variable here - material,state and delta
  const material = useRef()

  //useFrame is a R3F hook that allows you to perform operations on each frame of the animation
  //state: Represents the current state of the animation.
  //delta: Represents the time elapsed since the last frame. It's a measure of how much time has passed since the last animation update.
  useFrame((state, delta) => {
    material.current.uniforms.dashOffset.value -= delta / 100
    //console.log(material.current.uniforms.dashOffset.value);
  })
  //dashOffset is decreased by delta / 100
  //. A smaller value will result in a slower animation, while a larger value will make it faster.

  return (
    <mesh>
      <meshLineGeometry points={curve} />
      <meshLineMaterial ref={material} transparent lineWidth={0.01} color={color} dashArray={0.1} dashRatio={0.99} />
    </mesh>
  )
}

export default function Fireflies({ count, colors, radius = 10 }) {
  const lines = useMemo(
    () =>
      new Array(count).fill().map((_, index) => {
        //x- 0,y- 2 to 100, z-0
        const pos = new Vector3(Math.sin(0) * radius * r(), Math.cos(0) * radius * r(), 0)
        const points = new Array(30).fill().map((_, index) => {
          const angle = (index / 20) * Math.PI * 2
          return pos.add(new Vector3(Math.sin(angle) * radius * r(), Math.cos(angle) * radius * r(), 0)).clone()
        })
        const curve = new CatmullRomCurve3(points).getPoints(100)
        return {
          color: colors[parseInt(colors.length * Math.random())],
          curve,
        }
      }),
    [count, radius, colors],
  )
  return (
    <group position={[-radius * 2, -radius, 0]}>
    {lines.map((props, index) => (
        <Fatline key={index} {...props} />
    ))}
    </group>
  )
}
