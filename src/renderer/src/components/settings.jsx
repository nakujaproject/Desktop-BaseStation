import { useState, useContext } from "react"
import { Context } from "../ContextProvider"
import close from '../assets/close.svg'

export default function Settings() {
  let [option, setOption] = useState('network');

  let [network, setNetwork] = useContext(Context).Networks

  let [mqttIP, setMqttIP] = useState(network.mqtt.ip);
  let [mqttPort, setMqttPort] = useState(network.mqtt.port);
  let [mqttTopic, setMqttTopic] = useState(network.mqtt.topic);
  let [wsIP, setWsIP] = useState(network.ws.ip);
  let [wsPort, setWsPort] = useState(network.ws.port);
  let [mapIP, setMapIP] = useState(network.map.ip);
  let [mapPort, setMapPort] = useState(network.map.port);

  return (
    <div className="overlay" id="settings">
      <div className="relative container mx-auto mt-5 rounded-lg h-vh bg-slate-100 pb-8">
        <h1 className="text-2xl font-semibold text-center pb-6 pt-8">Settings</h1>
        <button className="absolute right-4 top-4 text-xl" onClick={e=>{document.getElementById('settings').style.visibility='hidden'}}>
          <img className="w-8" src={close} alt="" />
        </button>
        <div className="flex justify-around">
          <button className={`uppercase font-bold`} onClick={e=>setOption('network')}>Network</button>
          <button className={`uppercase font-bold`} onClick={e=>setOption('model')}>3D Model</button>
          <button className={`uppercase font-bold`} onClick={e=>setOption('stats')}>Stats</button>
        </div>
        {
          option === 'network'?
          <>
          <div className="my-8">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold pl-4">WiFi</h2>
              <hr />
              <div className="flex">
                <div className="flex mr-4 justify-around border-y-2 rounded-xl">
                  <div className={`px-4 font-semibold py-1 border-l-2 rounded-l-xl ${network.wifi.connected?'bg-green-600 text-white':''}`}>Connected</div>
                  <div className={`px-4 font-semibold py-1 border-r-2 rounded-r-xl ${!network.wifi.connected?'bg-red-600 text-white':''}`}>Disconnected</div>
                </div>
              </div>
            </div>
            <div className="flex ml-8">
              <p>SSID</p>
              <p>{network.wifi.ssid}</p>
            </div>
          </div>

          <div className="my-8">
          <div className="flex justify-between">
              <h2 className="text-xl font-semibold pl-4">MQTT</h2>
              <hr />
              <div className="flex">
                <div className="flex mr-4 justify-around border-y-2 rounded-xl">
                  <div className={`px-4 font-semibold py-1 border-l-2 rounded-l-xl ${network.mqtt.connected?'bg-green-600 text-white':''}`}>Connected</div>
                  <div className={`px-4 font-semibold py-1 border-r-2 rounded-r-xl ${!network.mqtt.connected?'bg-red-600 text-white':''}`}>Disconnected</div>
                </div>
              </div>
            </div>
            <table className="ml-8">
              <thead className="text-left py-4">
                <tr>
                  <th>IP Address</th>
                  <th>Port</th>
                  <th>Topic</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="text" placeholder="192.168.0.0" value={mqttIP} onChange={e=>setMqttIP(e.target.value)} /></td>
                  <td><input type="text" placeholder="1883" value={mqttPort} onChange={e=>setMqttPort(e.target.value)} /></td>
                  <td><input type="text" placeholder="n3/telemetry" value={mqttTopic} onChange={e=>setMqttTopic(e.target.value)} /></td>
                  <td><button onClick={e=>setNetwork({...network,mqtt:{ip:mqttIP,port:parseInt(mqttPort),topic:mqttTopic,}})}>Connect</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="my-8">
          <div className="flex justify-between">
              <h2 className="text-xl font-semibold pl-4">Web Socket</h2>
              <hr />
              <div className="flex">
                <div className="flex mr-4 justify-around border-y-2 rounded-xl">
                  <div className={`px-4 font-semibold py-1 border-l-2 rounded-l-xl ${network.ws.connected?'bg-green-600 text-white':''}`}>Connected</div>
                  <div className={`px-4 font-semibold py-1 border-r-2 rounded-r-xl ${!network.ws.connected?'bg-red-600 text-white':''}`}>Disconnected</div>
                </div>
              </div>
            </div>
            <table className="ml-8">
              <thead className="text-left py-4">
                <tr>
                  <th>IP Address</th>
                  <th>Port</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="text" placeholder="192.168.0.0" value={wsIP} onChange={e=>setWsIP(e.target.value)} /></td>
                  <td><input type="text" placeholder="1883" value={wsPort} onChange={e=>setWsPort(e.target.value)} /></td>
                  <td><button>Connect</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="my-8">
          <div className="flex justify-between">
              <h2 className="text-xl font-semibold pl-4">Map Server</h2>
              <hr />
              <div className="flex">
                <div className="flex mr-4 justify-around border-y-2 rounded-xl">
                  <div className={`px-4 font-semibold py-1 border-l-2 rounded-l-xl ${network.map.connected?'bg-green-600 text-white':''}`}>Connected</div>
                  <div className={`px-4 font-semibold py-1 border-r-2 rounded-r-xl ${!network.map.connected?'bg-red-600 text-white':''}`}>Disconnected</div>
                </div>
              </div>
            </div>
            <table className="ml-8">
              <thead className="text-left py-4">
                <tr>
                  <th>IP Address</th>
                  <th>Port</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="text" placeholder="192.168.0.0" value={mapIP} onChange={e=>setMapIP(e.target.value)}/></td>
                  <td><input type="text" placeholder="1883" value={mapPort} onChange={e=>setMapPort(e.target.value)} /></td>
                  <td><button>Connect</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          </>
          :
          option === 'model'?
          <div>
            <div className="flex justify-around">
              <div>
                <h3 className="text-lg font-semibold">X</h3>
                <input type="text" className="w-48" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Y</h3>
                <input type="text" className="w-48" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Z</h3>
                <input type="text" className="w-48" />
              </div>
            </div>
          </div>
          :
          <div>
          </div>
        }
      </div>
    </div>
  )
}