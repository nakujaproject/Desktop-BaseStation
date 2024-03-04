import { useRef,useEffect,useState, useContext } from 'react';
import MQTT from 'paho-mqtt'
import LineChart from './components/lineChart';
import Video from './components/Video';
import Model from './components/model';
import Countdown from './components/countdown';
import Map from './components/Map';
import { Context } from './ContextProvider';
import setting from './assets/setting.svg';
import parachute from './assets/parachute.svg';

let previousAltitude = 0;
function App() {
	let {Networks} = useContext(Context);
	let [network, setNetwork] = Networks;
	//
	let [client, setClient] = useState(null);

	useEffect(() => {
	if (!client) {
		setClient(new MQTT.Client(network.mqtt.ip, network.mqtt.port, `dashboard-${((new Date()).getTime()).toString().slice(4)}`));
	}
	}, []);
	useEffect(() => {
		try{
			// connect the client
			client.connect({
				onSuccess:onConnect,
				keepAliveInterval: 3600,
			});
			// set callback handlers
			client.onConnectionLost = onConnectionLost;
			client.onMessageArrived = onMessageArrived;
		}catch(e){
			console.log(e);
		}
	}, [client]);
	useEffect(() => {
		console.log(network.mqtt)
		setClient(new MQTT.Client(network.mqtt.ip, network.mqtt.port, `dashboard-${((new Date()).getTime()).toString().slice(4)}`));
	}, [network.mqtt]);
	//called when client connects
	let onConnect = () => {
		console.log("connected");
		client.subscribe(network.mqtt.topic);
		document.getElementById('connected').innerHTML = "MQTT connected";
		setNetwork({...network,mqtt:{...network.mqtt,connected:true}});
	}
	let eject = ()=>{
		let message = new MQTT.Message("eject");
		message.destinationName = "n3/command";
		try{
			client.send(message);
			//TODO: add a confirmation message
			alert('Ejection command sent');
		}catch(e){
			console.log(e);
			alert('Failed to send ejection command');
		}
	}


	let altitudeChartRef = useRef();
	let velocityChartRef = useRef();
	let accelerationChartRef = useRef();

	let toRadians = (angle) => {
		return angle * (Math.PI / 180);
	}

	let [altitude,setAltitude] = useState(0);//filterd altitude
	let [agl,setAGL] = useState(0);//filterd altitude
	let [gx,setGx] = useState(toRadians(0));
	let [gy,setGy] = useState(toRadians(180));
	let [gz,setGz] = useState(toRadians(0));
	let [latitude,setLatitude] = useState(-1.0953775626377544);
	let [longitude,setLongitude] = useState(37.01223403257954);
	let [state,setState] = useState(0);
	let [stream,setStream] = useState(true);
	let [apogee, setApogee] = useState(0);

	// called when the client loses its connection
	let onConnectionLost = (responseObject) => {
		if (responseObject.errorCode !== 0) {
		console.log("onConnectionLost:"+responseObject.errorMessage);
		}
		setNetwork({...network,mqtt:{...network.mqtt,connected:false}});
	}
	
	// called when a message arrives
	let onMessageArrived = (message) => {
		console.log("onMessageArrived:");
		let newData = JSON.parse(message.payloadString);
		let time = Date.now();
		if(parseInt(newData.altitude)>previousAltitude) setApogee(newData.altitude);
		previousAltitude = newData.filtered_s;
		setAltitude(newData.altitude);
		setAGL(newData.filtered_s);
		setGx(newData.gx);
		setGy(newData.gy);
		setGz(newData.gz);
		setLatitude(newData.latitude);
		setLongitude(newData.longitude);
		setState(newData.state);
		//charts update
		altitudeChartRef.current.data.datasets[0].data.push({ x: time, y: newData.altitude });
		altitudeChartRef.current.data.datasets[1].data.push({ x: time, y: newData.filtered_s });
		altitudeChartRef.current.update('quiet');
		//
		velocityChartRef.current.data.datasets[0].data.push({ x: time, y: newData.filtered_v });
		velocityChartRef.current.update('quiet');
		//
		accelerationChartRef.current.data.datasets[0].data.push({ x: time, y: newData.ax }); // ax
		accelerationChartRef.current.data.datasets[1].data.push({ x: time, y: newData.ay });
		accelerationChartRef.current.data.datasets[2].data.push({ x: time, y: newData.az });
		accelerationChartRef.current.data.datasets[3].data.push({ x: time, y: newData.filtered_a });
		accelerationChartRef.current.update('quiet');
	}

  return (
		<div className="lg:max-h-screen max-w-screen overflow-hidden">
			<main className="p-2">
				<div id='connected' className="text-sm lg:text-base text-center">
					MQTT not connected
				</div>
				<div className="text-xs lg:text-base md:w-2/3 mx-auto font-bold flex flex-wrap justify-between items-center al">
					<span className=' text-3xl'>
					T{true?'-':'+'} <Countdown target="November 27, 2023 13:00:00"/>
					</span>
					<span>State:{['PRE_FLIGHT','POWERED_FLIGHT','APOGEE','BALLISTIC_DESCENT','PARACHUTE_DESCENT','POST_FLIGHT'][parseInt(state)]} </span>
					<span>AGL: {agl}m</span>
					<span>APOGEE: {apogee}m</span>
					<div className='border-2 rounded-full flex justify-center items-center'>
						<button className='block hover:scale-125 px-6 py-2 border-r-2' onClick={e=>eject()}><img src={parachute} className='w-8' alt="" /></button>
						<button className='block hover:scale-125 px-6 py-2' onClick={e=>{document.getElementById('settings').style.visibility='visible'}}><img src={setting} className='w-7'/></button>
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 space-x-2 mt-4 lg:min-h-96 2xl:min-h-[55vh]">
					<div>
						<Model x={gx} y={gy} z={gz} />
					</div>
					<div>
						<Video/>
					</div>
					<div>
						<Map position={[latitude,longitude]}/>
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 2xl:mt-6">
					<div className="w-full lg:w-11/12">
						<LineChart ref={altitudeChartRef} type="altitude" />
					</div>
					<div className="w-full lg:w-11/12">
						<LineChart ref={velocityChartRef} type="velocity" />
					</div>
					<div className="w-full lg:w-11/12">
						<LineChart	ref={accelerationChartRef}	type="acceleration"/>
					</div>
				</div>
			</main>
		</div>
  )
}

export default App
