import React from 'react';
import logo from './logo.svg';
import './App.css';
import data from "./3d/data.json"
import World from "./3d/World";

export interface IMachineStructure {
    x: number,
    y: number,
    z: number,
    entry : {
        x: number,
        y: number
    },
    exit: {
        x: number,
        y: number
    }
}

export interface objectLog {
    type: string,
    id: number,
    pos: {
        x: number,
        y: number,
        z: number
    }
}

export type CyanoLog = objectLog;
export interface BallLog extends objectLog {
    docked: number,
    destroyed: number,
}

export interface timeLog {
    time: number,
    values: Array<CyanoLog | BallLog>,
}

export interface IFileStructure {
    machine: IMachineStructure,
    data: Array<timeLog>
}

interface IAppState {
    time: number,
    display: timeLog,
    times: Array<number>

    cyanos: boolean,
    balls: boolean,
    bubbles: boolean,
}

const json_data:IFileStructure = data as IFileStructure;

export const machine_const: IMachineStructure = json_data.machine;
console.log(JSON.stringify(machine_const, null, 2))

let interval: any = null;

export default class App extends React.Component<any, IAppState> {

    constructor(props) {
        super(props);

        this.setDisplay = this.setDisplay.bind(this);
        this.play = this.play.bind(this);
        this.setValue = this.setValue.bind(this);

        this.state = {
            time: 0,
            display: json_data.data[0],
            times: json_data.data.map(el => el.time),

            balls: true,
            bubbles: true,
            cyanos: true,
        }
    }

    setDisplay(time: number) {
        this.setState({time: time, display: json_data.data.filter(el => el.time === time)[0]})
    }

    play() {
        let time = this.state.time;
        const step = this.state.times[1] - this.state.times[0];
        const max = this.state.times[this.state.times.length - 1];
        interval = setInterval(() => {if (max >= time) time += step; this.setDisplay(time)}, 500);
    }

    pause() {
        clearInterval(interval);
        interval = null;
    }

    filterItems(data: timeLog) {
        const f = (el: objectLog) => {
            switch (el.type) {
                case "ObjectTypes.BALL":
                    return this.state.balls
                case "ObjectTypes.BUBBLE":
                    return this.state.bubbles
                case "ObjectTypes.CYANO_BACTERIA":
                    return this.state.cyanos
                default:
                    return false;
            }
        }
        return {
            ...data,
            values: data.values.filter(el => f(el))
        }
    }

    setValue(value) {
        this.setState({...this.state, ...value})
    }

    render() {
        return <div className="App">
            {
                this.state.display ?
                    <div className="world">
                        <World display={this.filterItems(this.state.display)}/>
                    </div>
                    : null
            }
            <div>
                <span>
                    <label htmlFor={"cyano"}>cyanos</label><input id={"cyano"} type={"checkbox"} defaultChecked={this.state.cyanos} onChange={() => this.setValue({cyanos: !this.state.cyanos})}/>
                    <label htmlFor={"bubbles"}>bubbles</label><input id={"bubbles"} type={"checkbox"} defaultChecked={this.state.bubbles} onChange={() => this.setValue({bubbles: !this.state.bubbles})}/>
                    <label htmlFor={"balls"}>balls</label><input id={"balls"} type={"checkbox"} defaultChecked={this.state.balls} onChange={() => this.setValue({balls: !this.state.balls})}/>
                </span>
                <span>
                    <span>{JSON.stringify(this.state.display.time)}</span>
                    <input
                        type={"range"}
                        defaultValue={this.state.display.time}
                        min={this.state.times[0]}
                        max={this.state.times[this.state.times.length - 1]}
                        step={this.state.times[1] - this.state.times[0]}
                        onChange={e => {this.setDisplay(parseInt(e.target.value))}}
                    />
                    <button onClick={this.play}>Play</button>
                    <button onClick={() => {this.pause(); interval = null;}}>Pause</button>
                </span>
            </div>
        </div>;
    }
}
