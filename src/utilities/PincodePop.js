import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem, Button, Input, InputGroup, InputGroupText } from 'reactstrap';
import { setLocation } from '../redux/slices/settingSlice';
import toast from 'react-hot-toast';
import OverLoader from './OverLoader';

const storeData = [
    { _id: "64b5f0c9f7e9a5d1e9a1f001", name: "Foodie - Dombivli", address: "123 Main Road, Dombivli East, Maharashtra", pincode: "421201", city: "Dombivli" },
    { _id: "64b5f0c9f7e9a5d1e9a1f002", name: "Foodie - Panvel", address: "45 Central Avenue, Panvel, Maharashtra", pincode: "410206", city: "Panvel" },
    { _id: "64b5f0c9f7e9a5d1e9a1f003", name: "Foodie - Dadar", address: "78 Hill Street, Dadar West, Maharashtra", pincode: "400014", city: "Dadar" },
    { _id: "64b5f0c9f7e9a5d1e9a1f004", name: "Foodie - Matunga", address: "22 Flower Lane, Matunga East, Maharashtra", pincode: "400019", city: "Matunga" },
    { _id: "64b5f0c9f7e9a5d1e9a1f005", name: "Foodie - Virar", address: "89 Market Road, Virar West, Maharashtra", pincode: "401303", city: "Virar" },
    { _id: "64b5f0c9f7e9a5d1e9a1f006", name: "Foodie - Thane", address: "33 Green Street, Thane West, Maharashtra", pincode: "400601", city: "Thane" },
    { _id: "64b5f0c9f7e9a5d1e9a1f007", name: "Foodie - Navi Mumbai", address: "55 Tech Park, Vashi, Navi Mumbai, Maharashtra", pincode: "400703", city: "Navi Mumbai" },
    { _id: "64b5f0c9f7e9a5d1e9a1f008", name: "Foodie - Kalyan", address: "12 Station Road, Kalyan West, Maharashtra", pincode: "421301", city: "Kalyan" },
    { _id: "64b5f0c9f7e9a5d1e9a1f009", name: "Foodie - Borivali", address: "67 Sunset Avenue, Borivali West, Maharashtra", pincode: "400092", city: "Borivali" },
    { _id: "64b5f0c9f7e9a5d1e9a1f010", name: "Foodie - Bandra", address: "101 Beach Road, Bandra West, Maharashtra", pincode: "400050", city: "Bandra" },
];


export default function PincodePop() {
    const dispatch = useDispatch();
    const location = useSelector((state) => state.settings.locationData);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStores, setFilteredStores] = useState(storeData);
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectStore = (store) => {
        dispatch(setLocation({ location: store, showModal: false }));
    };

    const handleModal = () => {
        dispatch(setLocation({ ...location, showModal: !location.showModal }));
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredStores(
            storeData.filter(
                (store) =>
                    store.name.toLowerCase().includes(term) ||
                    store.address.toLowerCase().includes(term) ||
                    store.pincode.includes(term)
            )
        );
    };

    const fetchCurrentLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        setIsLoading(true)
                        const response = await fetch(
                            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                        );
                        const data = await response.json();
    
                        const userPincode = data.postcode || null;
    
                        if (userPincode) {
                            setSearchTerm(userPincode);
                            setFilteredStores(storeData.filter((store) => store.pincode === userPincode));
                        } else {
                            toast.error(
                                "Could not fetch the pincode for your location. Please enter the pincode manually."
                            );
                        }
                    } catch (error) {
                        console.error("Error fetching location:", error);
                        toast.error("Failed to fetch location. Please try again later.");
                    } finally {
                        setIsLoading(false)
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    toast.error("Could not fetch your location. Please enable location services.");
                }
            );
        } else {
            toast.error("Geolocation is not supported by your browser.");
        }
    };
    

    return (
        <div>
            {
                isLoading && <OverLoader/>
            }
            <Modal isOpen={location.showModal} toggle={location?.location ? handleModal : undefined} backdrop="static">
                <ModalHeader toggle={location?.location ? handleModal : null}>
                    Select Your Nearest Foodie Store
                </ModalHeader>
                <ModalBody style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <InputGroup className="mb-3">
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search by name, address, or pincode"
                        />
                        <InputGroupText>
                            <Button color="secondary" onClick={fetchCurrentLocation}>
                                Use Current Location
                            </Button>
                        </InputGroupText>
                    </InputGroup>
                    <ListGroup>
                        {filteredStores.length > 0 ? (
                            filteredStores.map((store) => (
                                <ListGroupItem
                                    key={store._id}
                                    className="d-flex justify-content-between align-items-center"
                                    action
                                    
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div>
                                        <strong>{store.name}</strong>
                                        <br />
                                        {store.address} - {store.pincode}
                                    </div>
                                    <button onClick={() => handleSelectStore(store)} className={`btn  ${location?.location?._id === store._id ? 'btn-primary' : 'btn-outline-primary'}`} size="sm">
                                    {location?.location?._id === store._id ? 'Selected' : 'Select'}
                                    </button>
                                </ListGroupItem>
                            ))
                        ) : (
                            <p>No stores found for the given search.</p>
                        )}
                    </ListGroup>
                </ModalBody>
            </Modal>
        </div>
    );
}
