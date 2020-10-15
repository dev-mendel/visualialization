import * as React from "react";
import { Canvas } from "react-three-fiber"
import Model from "./Model";
import {Background} from "./Background";
import {Controls} from "./Controls";
import {timeLog, IMachineStructure} from "../App";

export interface IWorldPropsData {
    display: timeLog,
}

export default class World extends React.Component<IWorldPropsData, any> {
    render() {
        return <Canvas camera={{ position: [0, 20, 30] }}>
            >
            <Model objects={this.props.display.values} />
            <Background/>
            <Controls/>
        </Canvas>;
    }
}
