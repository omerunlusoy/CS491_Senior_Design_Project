import React, {useEffect} from "react";
import './map.css';
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";
import Drawer from '@mui/material/Drawer';
import AnalysisInfoDrawer from "./AnalysisInfoDrawer";
import Button from "@material-ui/core/Button";
import Navbar from "./Navbar";
import {Box, Card, CardActionArea, CardContent, CircularProgress, Dialog, Grid, Typography} from "@material-ui/core";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import PollenTypes from "./PollenTypesList";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import InfoIcon from "@mui/icons-material/Info";
import PollenNormalNames from "./PollenNormalNames";
import axios from "axios";

//api key: "AIzaSyAHlwtPiz1TdtLSNXtladNYvGRtCbzkm6g"
//api_key_irem2 : "AIzaSyBKACLg3Nl9SOXYQkYdiMeTR9cVNS2_rJQ"
//api_key_ece: "AIzaSyCovV7pf9gtNN93EAgzMqOZLYie_e27Gno"
//omer: "AIzaSyDr2mi0HT_Hu22x6sriuAYIx1a6M3uWSRU"

const libraries = ["places"];
const mapContainerStyle = {
    height: "100vh",
    width: "94vw",
};
const options = {
    //styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
};
const center = {
    lat: 38.749447369341944,
    lng: 34.915717273488404,
};

export default function Map() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyDr2mi0HT_Hu22x6sriuAYIx1a6M3uWSRU",
        libraries,
    });
    const [markers, setMarkers] = React.useState([]);
    const [selected, setSelected] = React.useState(null);
    const [openD, setOpenD] = React.useState(false);
    const [openDLoading, setOpenDLoading] = React.useState(true);

    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());


    useEffect(() => {
        fetch(`http://localhost:8000/api/analysis_get`)
            .then((data) => data.json())
            .then((data) => {setMarkers(data);setOpenDLoading(false)})
    },[]);

    const handleClose = () => {
        setOpenD(false);
    };


    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
    }, []);

    const [plsOpen, setPlsOpen] = React.useState(true);

    const names = [
        'ambrosia_artemisiifolia',
        'alnus_glutinosa',
        'acer_negundo',
        'betula_papyrifera',
        'juglans_regia',
        'artemisia_vulgaris',
        'populus_nigra',
        'phleum_phleoides',
        'picea_abies',
        'juniperus_communis',
        'ulmus_minor',
        'quercus_robur',
        'carpinus_betulus',
        'ligustrum_robustrum',
        'rumex_stenophyllus',
        'ailanthus_altissima',
        'thymbra_spicata',
        'rubia_peregrina',
        'olea_europaea',
        'cichorium_intybus',
        'chenopodium_album',
        'borago_officinalis',
        'acacia_dealbata'
    ];

    const checkedArrHere = [
        true,true,true,true,true,true,true,true,true,
        true,true,true,true,true,true,true,true,true,
        true,true,true,true,true
    ];

    const [pollenArr, setPollenArr] = React.useState(names);
    const [checkedArr, setCheckedArr] = React.useState(checkedArrHere);

    const handleCallback = (childData) =>{
        setPlsOpen(childData)
    }



    const handleCallbackForPollens = (childDataPollen) =>{

        console.log("child to parent", childDataPollen);
        setPollenArr(childDataPollen[0])
        setCheckedArr(childDataPollen[1])
        setOpenD(childDataPollen[2])
        setMarkers(childDataPollen[3])

    }

    const [x, setX] = React.useState(false);
    useEffect(() => {

        if ( x ){
            console.log("hey");
            console.log(pollenArr)

            let sampleObject = new FormData(); // creates a new FormData object

            let myObject = {
                pollens: pollenArr,
                startDate: startDate,
                endDate: endDate
            };

            sampleObject.append("pollens",myObject.pollens);
            sampleObject.append("startDate", myObject.startDate);
            sampleObject.append("endDate", myObject.endDate);// add your file to form data

            setOpenDLoading(true);


            axios
                .post('http://127.0.0.1:8000/api/get_filtered_samples/', sampleObject)
                .then(response => {
                    console.log(response.data)
                    setMarkers(response.data)
                    setOpenDLoading(false);

                })
                .catch(error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                })
        }
        else {
            console.log("ho");
            console.log(pollenArr)
            setX(true)
        }

        }, [pollenArr]);



    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    return (
        <div>
            <Dialog
                open={openDLoading}
            >
                <Card>
                    <CardActionArea>
                        <CardContent>
                            <Typography align={"center"}  variant="h5" >
                                Analyses are loading. Thank you for your patience.
                            </Typography>
                            <Box sx={{ display: 'flex' }}>
                                <CircularProgress/>
                            </Box>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Dialog>
            <div style={{marginBottom:10}}>
                <Button onClick={()=>{setOpenD(true)}} variant="contained" style={{backgroundColor:'#A6232A', color:'white'}} size="medium" >
                    Filter
                </Button>
            </div>
            <Dialog
                open={openD}
                onClose={handleClose}
            >

                <div>
                    <IconButton style={{align:"left"}} onClick={handleClose} aria-label="close" >
                        <CloseIcon sx={{ color: "#A6232A" }}/>
                    </IconButton>
                </div>
                <Typography align={"center"}  variant="h5" >
                    Select Time Interval
                </Typography>
                <Grid container>
                    <Grid item  xs={60} style={{marginLeft: 150, marginRight:30, marginBottom:30}} >

                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                        />

                    </Grid>
                    <Grid item  xs={60} >


                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                        />
                    </Grid>


                    <Grid item  xs={60} >
                                <Card style={{marginBottom: 10}}>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography align={"center"}  variant="h5" >
                                                Select Pollen Types
                                            </Typography>
                                            <div>
                                                    <Box mt={2}>
                                                        <div>
                                                            <PollenTypes markers={markers} openD={openD} pollens={pollenArr} checkedArr={checkedArr} startDate={startDate} endDate = {endDate} parentCallback={handleCallbackForPollens}/>
                                                        </div>
                                                    </Box>
                                            </div>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                    <Grid item  xs={60} >
                        <Card>
                            <CardActionArea>
                                <CardContent>
                                    <Typography align={"center"}  variant="h5" >
                                        Non Technical Pollen Names
                                    </Typography>
                                    <div>
                                        <Box mt={2}>
                                            <div align={"center"}>
                                                <PollenNormalNames/>
                                            </div>
                                        </Box>
                                    </div>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>

            </Dialog>

            <Locate panTo={panTo} />
            <Search panTo={panTo} />

            <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={6}
                center={center}
                options={options}
                onLoad={onMapLoad}
            >
                {markers.map((marker) => (
                    <Marker
                        key={`${marker.sample_id}`}
                        position={{ lat: marker.location_latitude, lng: marker.location_longitude }}
                        onClick={() => {
                            setSelected(marker);
                            setPlsOpen(true);
                        }}
                        icon={{
                            url: `/microscope_marker.png`,
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                            scaledSize: new window.google.maps.Size(30, 30),
                        }}
                    />
                ))}


                {selected ? (
                    <AnalysisInfoDrawer sample_id={selected.sample_id} open={plsOpen} parentCallback={handleCallback}/>
                ) : null}

            </GoogleMap>
        </div>
    );
}

function Locate({ panTo }) {
    return (
        <div>
            <button
                className="locate"
                onClick={() => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            console.log("lat:",position.coords.latitude);
                            console.log("lng:",position.coords.longitude);
                            panTo({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            });
                        },
                        () => null
                    );

                }}
            >
                <img src="/compass.svg" alt="compass" />
            </button>
        </div>
    );
}

function Search({ panTo }) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 43.6532, lng: () => -79.3832 },
            radius: 100 * 1000,
        },
    });

    // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

    const handleInput = (e) => {
        setValue(e.target.value);
    };

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            panTo({ lat, lng });
        } catch (error) {
            console.log("😱 Error: ", error);
        }
    };

    return (
        <div className="search">
            <Combobox onSelect={handleSelect}>
                <ComboboxInput
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder="Search your location"
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" &&
                        data.map(({ id, description }) => (
                            <ComboboxOption key={id} value={description} />
                        ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    );
}
