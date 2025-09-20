import React, { useState, useEffect, useRef } from 'react';
import { MeshPeer } from '../types';
import { WifiNodesIcon } from './icons/WifiNodesIcon';

const MOCK_PEERS: MeshPeer[] = [
    { id: 'peer-a', name: 'Device 7C:B8', status: 'offline', signal: 85 },
    { id: 'peer-b', name: 'Device A1:4F', status: 'offline', signal: 92 },
    { id: 'peer-c', name: 'Device 3D:E2', status: 'online-gateway', signal: 60 },
    { id: 'peer-d', name: 'Device B9:11', status: 'offline', signal: 75 },
];

const MeshNetwork: React.FC = () => {
    const [isSimulating, setIsSimulating] = useState(false);
    const [peers, setPeers] = useState<MeshPeer[]>([]);
    const [message, setMessage] = useState('');
    const [simulationLog, setSimulationLog] = useState<string[]>([]);
    const [isSending, setIsSending] = useState(false);
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [simulationLog]);

    useEffect(() => {
        if (isSimulating) {
            setSimulationLog(['Offline mode activated. Searching for nearby peers...']);
            setTimeout(() => {
                setPeers(MOCK_PEERS);
                setSimulationLog(prev => [...prev, `Found ${MOCK_PEERS.length} peers.`]);
            }, 2000);
        } else {
            setPeers([]);
            setSimulationLog([]);
            setIsSending(false);
            setMessage('');
        }
    }, [isSimulating]);
    
    const handleSendSOS = async () => {
        if (!message.trim() || isSending || !isSimulating) return;

        setIsSending(true);
        setSimulationLog(prev => [...prev, `Sending SOS: "${message.trim()}"`]);

        const path = [];
        const offlinePeers = peers.filter(p => p.status === 'offline').sort(() => 0.5 - Math.random());
        const gateway = peers.find(p => p.status === 'online-gateway');

        if (!gateway) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSimulationLog(prev => [...prev, "ERROR: No online gateway found nearby. Cannot send message."]);
            setIsSending(false);
            return;
        }

        const hops = [...offlinePeers.slice(0, 2), gateway];

        for (const hop of hops) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            path.push(hop.name);

            if (hop.status === 'offline') {
                setSimulationLog(prev => [...prev, `Message relayed to ${hop.name} (Offline). Finding next hop...`]);
            } else {
                setSimulationLog(prev => [...prev, `Message reached ${hop.name} (Online Gateway)!`]);
                await new Promise(resolve => setTimeout(resolve, 1000));
                setSimulationLog(prev => [...prev, "Relaying SOS to emergency services..."]);
                await new Promise(resolve => setTimeout(resolve, 2000));
                setSimulationLog(prev => [
                    ...prev, 
                    "SUCCESS: SOS message delivered to authorities!",
                    `Path: You -> ${path.join(' -> ')} -> Emergency Services`
                ]);
                setIsSending(false);
                return;
            }
        }
    };

    return (
        <div className="bg-brand-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-brand-gray-700">
            <h2 className="text-3xl font-bold text-brand-gray-100 mb-2 flex items-center gap-3">
                <WifiNodesIcon />
                Peer-to-Peer Mesh Network
            </h2>
            <p className="text-brand-gray-400 mb-6">
                When cell towers are down, send an SOS through nearby app users. This simulation shows how your message "hops" between devices to reach help.
            </p>

            <div className="flex items-center gap-4 mb-6 p-4 bg-brand-gray-900/50 rounded-lg border border-brand-gray-700">
                <label htmlFor="sim-toggle" className="font-semibold text-brand-gray-200">Simulate Offline Mode</label>
                <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                    <input 
                        type="checkbox" 
                        name="sim-toggle" 
                        id="sim-toggle"
                        checked={isSimulating}
                        onChange={() => setIsSimulating(!isSimulating)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label htmlFor="sim-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-brand-gray-600 cursor-pointer"></label>
                </div>
                <style>{`.toggle-checkbox:checked { right: 0; border-color: #007BFF; } .toggle-checkbox:checked + .toggle-label { background-color: #007BFF; }`}</style>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-xl font-semibold text-brand-blue mb-3">Nearby Peers</h3>
                    <div className="space-y-2 min-h-[150px]">
                        {isSimulating && peers.length === 0 && <p className="text-brand-gray-400">Searching...</p>}
                        {peers.map(peer => (
                            <div key={peer.id} className="flex items-center justify-between p-3 bg-brand-gray-700 rounded-md">
                                <span className="font-mono text-sm text-brand-gray-300">{peer.name}</span>
                                <div className={`px-2 py-0.5 text-xs font-semibold rounded-full ${peer.status === 'online-gateway' ? 'bg-green-500/20 text-green-300' : 'bg-brand-gray-600 text-brand-gray-400'}`}>
                                    {peer.status === 'online-gateway' ? 'Online Gateway' : 'Offline'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-brand-blue mb-3">Send Offline SOS</h3>
                     <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="e.g., Trapped in building, need medical aid."
                        rows={3}
                        className="w-full p-2 bg-brand-gray-700 border border-brand-gray-600 rounded-md text-brand-gray-100 focus:ring-2 focus:ring-brand-blue disabled:opacity-50"
                        disabled={!isSimulating || isSending}
                    />
                    <button
                        onClick={handleSendSOS}
                        disabled={!isSimulating || isSending || !message.trim()}
                        className="w-full mt-2 py-3 bg-brand-orange text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition-colors disabled:bg-brand-gray-600 disabled:cursor-not-allowed"
                    >
                        {isSending ? 'Sending...' : 'Broadcast SOS via Peers'}
                    </button>
                </div>
            </div>

            <div className="mt-6 border-t border-brand-gray-700 pt-4">
                 <h3 className="text-xl font-semibold text-brand-blue mb-3">Simulation Log</h3>
                 <div ref={logContainerRef} className="h-48 bg-black/50 p-3 rounded-lg font-mono text-sm text-brand-gray-300 overflow-y-auto border border-brand-gray-700">
                    {simulationLog.map((log, index) => (
                        <p key={index} className={`whitespace-pre-wrap ${log.startsWith('SUCCESS') ? 'text-green-400' : ''} ${log.startsWith('ERROR') ? 'text-red-400' : ''}`}>
                            &gt; {log}
                        </p>
                    ))}
                    {isSending && <div className="w-2 h-2 mt-2 rounded-full bg-brand-gray-400 animate-pulse"></div>}
                 </div>
            </div>
        </div>
    );
};

export default MeshNetwork;
