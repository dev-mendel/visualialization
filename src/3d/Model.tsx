import * as React from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber"
import {BallLog, CyanoLog, IMachineStructure, machine_const, objectLog} from "../App";
import * as THREE from 'three'
import {useCallback, useMemo} from "react";

export interface IModelPropsData {
    objects: Array<objectLog>,
}

export interface IPoint {
    x: number,
    y: number,
    z: number,
}

export default class Model extends React.Component<IModelPropsData, any> {
    display(el: objectLog) {
        console.log("Type: " + el.type);
        switch (el.type) {
            case "ObjectTypes.CYANO_BACTERIA":
                return <Cyano data={el} />
            case "ObjectTypes.BALL":
                return <Ball data={el} />
        }
    }
    render() {
        return <mesh position={[0,0,0]}>
            {this.props.objects.map(el => this.display(el))}
            <Ball data={{id: 1, type: "Ball", pos: {x: 0, y: 0, z: 0}}}/>
            <Machine machine={machine_const}/>
        </mesh>;
    }
}

export class Cyano extends React.Component<{data: objectLog}> {
    render() {
        const p = this.props.data.pos
        return <mesh position={[p.x, p.y, p.z]}>
            <sphereGeometry attach="geometry" args={[0.25, 10, 32]} />
            {/*<meshStandardMaterial color="green" />*/}
            <meshNormalMaterial attach="material" />
        </mesh>;
    }
}

export class Ball extends React.Component<{data: objectLog}> {
    render() {
        const p = this.props.data.pos
        return <mesh position={[p.x, p.y, p.z]}>
            <sphereGeometry attach="geometry" args={[0.6, 10, 32]} />
            <meshNormalMaterial attach="material" />
        </mesh>;
    }
}

/**
 * Must be ortogonal
 */
export class Line extends React.Component<{start: IPoint, end: IPoint}> {
    render() {
        const start = this.props.start;
        const end = this.props.end;
        const width:number = 0.5;
        const diff: IPoint = {
            x: (end.x - start.x) === 0 ? width : (end.x - start.x),
            y: (end.y - start.y) === 0 ? width : (end.y - start.y),
            z: (end.z - start.z) === 0 ? width : (end.z - start.z),
        }
        /*console.log(JSON.stringify(start, null, 2))
        console.log(JSON.stringify(end, null, 2))
        console.log(JSON.stringify(diff, null, 2))
        console.log("--------------------------------------------")*/
        return <mesh position={[start.x + (diff.x / 2), start.y +(diff.y / 2), start.z + (diff.z / 2)]}>
            <boxBufferGeometry attach="geometry" args={[diff.x, diff.y, diff.z]} />
            <meshNormalMaterial attach="material" />
        </mesh>;
    }
}

export class Machine extends React.Component<{ machine: IMachineStructure }, {lines: Array<{start: IPoint, end: IPoint}>}> {
    constructor(props) {
        super(props);

        const m = this.props.machine;
        const entry_start_diff_y = (m.y - m.entry.x) / 2;
        const entry_start_diff_z = (m.z - m.entry.y) / 2;
        const exit_start_diff_y = (m.y - m.exit.x) / 2;
        const exit_start_diff_z = (m.z - m.exit.y) / 2;

        this.state = {
            lines: [
                // machine dimensions
                {start:{x: 0, y: 0, z:0}, end:{x: m.x, y: 0, z:0}},
                {start:{x: 0, y: 0, z:0}, end:{x: 0, y: m.y, z:0}},
                {start:{x: 0, y: 0, z:0}, end:{x: 0, y: 0, z:m.z}},


                {start:{x: m.x, y: 0, z:0}, end:{x: m.x, y: m.y, z:0}},
                {start:{x: m.x, y: 0, z:0}, end:{x: m.x, y: 0, z:m.z}},

                {start:{x: 0, y: m.y, z:0}, end:{x: 0, y: m.y, z:m.z}},
                {start:{x: 0, y: m.y, z:0}, end:{x: m.x, y: m.y, z:0}},

                {start:{x: 0, y: 0, z:m.z}, end:{x: 0, y: m.y, z:m.z}},
                {start:{x: 0, y: 0, z:m.z}, end:{x: m.x, y: 0, z:m.z}},

                {start:{x: m.x, y: m.y, z:0}, end:{x: m.x, y: m.y, z:m.z}},
                {start:{x: 0, y: m.y, z:m.z}, end:{x: m.x, y: m.y, z:m.z}},
                {start:{x: m.x, y: 0, z:m.z}, end:{x: m.x, y: m.y, z:m.z}},

                //entries
                {start:{x: 0, y: entry_start_diff_y, z:entry_start_diff_z}, end:{x: 0, y: entry_start_diff_y + m.entry.x, z:entry_start_diff_z + m.entry.y}},

                // exit
                {start:{x: m.x, y: exit_start_diff_y, z:exit_start_diff_z}, end:{x: m.x, y: exit_start_diff_y + m.entry.x, z:exit_start_diff_z + m.entry.y}},
            ]
        }
    }

    render() {
        return <mesh position={[0,0,0]}>
            {
                this.state.lines.map((el, i) => <Line key={i} start={el.start} end={el.end}/>)
            }
        </mesh>;
    }
}

const Cyano2 = () => {
    return (
        <mesh position={[0, 0, 0]}>
            <cylinderBufferGeometry attach="geometry" args={[5, 5, 5]} />
            <meshNormalMaterial attach="material" />
        </mesh>
    )
}
const Model2 = () => {
    return (
        <mesh>
            <mesh position={[-5, -1.5, -3]}>
                <boxBufferGeometry attach="geometry" args={[6, 2, 5]} />
                <meshNormalMaterial attach="material" />
            </mesh>
            <mesh>
                <mesh position={[0, 3, -1]}>
                    <octahedronBufferGeometry attach="geometry" args={[4]} />
                    <meshNormalMaterial attach="material" />
                </mesh>
                <mesh position={[3, 0.5, 3]}>
                    <sphereGeometry attach="geometry" args={[3, 10, 32]} />
                    <meshNormalMaterial attach="material" />
                </mesh>
            </mesh>
        </mesh>
    )
}
