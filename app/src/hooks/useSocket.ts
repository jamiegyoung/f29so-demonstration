import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { useEffect, useState } from 'react';

type UriOptions = {
  uri: string;
  opts?: Partial<ManagerOptions & SocketOptions>;
};

type SetSocket = React.Dispatch<React.SetStateAction<UriOptions | null>>;

const useSocket = (): [Socket | null, SetSocket] => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const [socketDetails, setSocketDetails] = useState<UriOptions | null>(null);

  useEffect(() => {
    if (!socketDetails) {
      return;
    }
    
    const newSocket = io(socketDetails.uri, socketDetails.opts);
    setSocket(newSocket);
  }, [socketDetails]);

  return [socket, setSocketDetails];
};

export default useSocket;
