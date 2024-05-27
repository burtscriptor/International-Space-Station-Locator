import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import img from './assets/components/astronaut.png';
import sunset from './assets/components/sunset.png';
import earth from './assets/components/trees.png';
import iss from './assets/components/iss.png';
import sunrise from './assets/components/sunrise.png';
import { Box, Flex } from '@chakra-ui/react';
import { APIProvider, Map, AdvancedMarker, useMarkerRef, InfoWindow } from '@vis.gl/react-google-maps';

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

function App() {
  const [markerRef, marker] = useMarkerRef('one');
  const [open, setOpen] = useState(false);
  const [issLocation, setIssLocation] = useState({ lat: 0, lng: 0 });
  const [inSpace, setInSpace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(true);
  const [map, setMap] = useState(null); // Define setMap using useState

  useEffect(() => {
    if (!marker) {
      return;
    }
    console.log('do something with marker?');
  }, [marker]);

  useEffect(() => {
    const getIssLocation = async () => {
      const res = await axios.get('http://api.open-notify.org/iss-now.json');
      const { longitude, latitude } = res.data.iss_position;
      setIssLocation({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
    };

    const intervalId = setInterval(() => {
      getIssLocation();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const getAstronauts = async () => {
      const res = await axios.get('http://api.open-notify.org/astros.json');
      setInSpace(res.data);
      setIsLoading(false);
    };

    getAstronauts();
  }, []);

  return (
    <div className='main'>
      {isLoading ? (
        <p>Loading..</p>
      ) : (
        <Flex
          position="relative"
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
          h="100vh"
          w="100vw"
        >
          {inSpace ? (
            <Box position="relative" display="flex" flexDirection="row" alignItems="center" justifyContent="center" >
              <div className="info">
                <h1>International Space Station Locator</h1>
                  {/* The <img className="icons" src={iss} alt="ISS" /> orbits the <img className="icons" src={earth} alt="Earth" /> every 90 minutes, which gives the <img className="icons" src={img} alt="Astronaut" /> 16 <img className="icons" src={sunrise} alt="Sunrise" /> and <img src={sunset} className="icons" alt="Sunset" /> every day. */}
                
              </div>
            </Box>
          ) : (
            <p></p>
          )}
          <Box position="relative" left={0} top={0} h="60%" w="60%" >
            <APIProvider apiKey={apiKey}>
              <Map
                mapId="269bcd1f5ba584f8"
                mapTypeId="satellite"
                defaultCenter={issLocation}
                defaultZoom={5}
                mapContainerStyle={{ width: '60%', height: '60%' }}
                onLoad={map => setMap(map)} // Use setMap here
              >
                <AdvancedMarker position={issLocation} onClick={() => { setOpen(true); setShow(false); }}>
                  <img className="icon" src={img} alt="Astronaut" />
                </AdvancedMarker>
                {open && inSpace && (
                  <InfoWindow position={issLocation} onCloseClick={() => setOpen(false)}>
                    We're on the ISS!
                    {inSpace.people.map((person, index) => (
                      <p key={index}>{person.name}</p>
                    ))}
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
            <div className={show ? 'in-space' : 'hide'}>
                <p color="white">Click on the astronaut!</p>
              </div>
          </Box>
        </Flex>
      )}
    </div>
  );
}

export default App;
