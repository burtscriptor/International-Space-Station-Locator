import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import img from './assets/components/astronaut.png';
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
  const [error, setError] = useState(null);
  const [isLoadingMap, setIsLoadingMap] = useState(true);

  useEffect(() => {
    const getIssLocation = async () => {
      try {
        const res = await axios.get('/api');
        console.log('this is res', res)
        const { longitude, latitude } = res.data.NASA;
        setIssLocation({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
      } catch (error) {
        setError(error.message);
        console.log('this is error from OpenISS', error)
      } finally {
        setIsLoadingMap(false); // Set loading state to false once location is fetched
      }
    };

    const intervalId = setInterval(() => {
      getIssLocation();
    }, 7000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const getAstronauts = async () => {
      try {
        const res = await axios.get('api/astros');
        console.log('astros', res.data.astros.people)
        setInSpace(res.data.astros.people);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
      }
    };

    getAstronauts();
  }, []);

  useEffect(() => {
    if (!marker) {
      return;
    }
    console.log('do something with marker?');
  }, [marker]);

  return (
    <div className='main'>
      {isLoading ? (
        <p>Loading..</p>
      ) : error ? (
        <p>Error: {error}</p>
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
              </div>
            </Box>
          ) : (
            <p></p>
          )}
          <Box position="relative" left={0} top={0} h="60%" w="60%" >
            {isLoadingMap ? (
              <p>Loading map...</p>
            ) : (
              <APIProvider apiKey={apiKey}>
                <Map
                  mapId="269bcd1f5ba584f8"
                  mapTypeId="satellite"
                  defaultCenter={issLocation}
                  defaultZoom={5}
                  mapContainerStyle={{ width: '60%', height: '60%' }}
                  onLoad={map => setMap(map)}
                >
                  <AdvancedMarker position={issLocation} onClick={() => { setOpen(true); setShow(false); }}>
                    <img className="icon" src={img} alt="Astronaut" />
                  </AdvancedMarker>
                  {open && inSpace && (
                    <InfoWindow position={issLocation} onCloseClick={() => setOpen(false)}>
                      We're on the ISS!
                      {inSpace.map((person, index) => (
                        <p key={index}>{person.name}</p>
                      ))}
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
            )}
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
