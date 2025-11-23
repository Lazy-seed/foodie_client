import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem, Button, Input, InputGroup } from 'reactstrap';
import { MapPin, Search, Navigation } from 'react-feather';
import { setLocation } from '../redux/slices/settingSlice';
import toast from 'react-hot-toast';

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
    const location = useSelector((state) => state.settings?.locationData);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStores, setFilteredStores] = useState(storeData);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    const handleSelectStore = (store) => {
        dispatch(setLocation({ location: store, showModal: false }));
        toast.success(`Location set to ${store.city}`);
    };

    const handleModal = () => {
        dispatch(setLocation({ ...location, showModal: !location?.showModal }));
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredStores(
            storeData.filter(
                (store) =>
                    store.name.toLowerCase().includes(term) ||
                    store.address.toLowerCase().includes(term) ||
                    store.city.toLowerCase().includes(term) ||
                    store.pincode.includes(term)
            )
        );
    };

    const fetchCurrentLocation = async () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            return;
        }

        setIsLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );
                    const data = await response.json();

                    const userPincode = data.postcode || null;

                    if (userPincode) {
                        setSearchTerm(userPincode);
                        const filtered = storeData.filter((store) => store.pincode === userPincode);
                        setFilteredStores(filtered);

                        if (filtered.length === 0) {
                            toast.error("No stores found in your area. Showing all stores.");
                            setFilteredStores(storeData);
                        } else {
                            toast.success(`Found ${filtered.length} store(s) near you`);
                        }
                    } else {
                        toast.error("Could not fetch your pincode. Please search manually.");
                    }
                } catch (error) {
                    console.error("Error fetching location:", error);
                    toast.error("Failed to fetch location. Please try again.");
                } finally {
                    setIsLoadingLocation(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast.error("Could not access your location. Please enable location services.");
                setIsLoadingLocation(false);
            }
        );
    };

    return (
        <Modal
            isOpen={location?.showModal || false}
            toggle={location?.location ? handleModal : undefined}
            backdrop="static"
            size="lg"
            centered
        >
            <ModalHeader toggle={location?.location ? handleModal : null}>
                <div className="flex items-center gap-2">
                    <MapPin size={24} className="text-red-600" />
                    <span>Select Your Nearest Store</span>
                </div>
            </ModalHeader>
            <ModalBody>
                {/* Search Bar */}
                <InputGroup className="mb-4">
                    <div className="input-group-prepend">
                        <span className="input-group-text bg-white border-end-0">
                            <Search size={18} className="text-gray-400" />
                        </span>
                    </div>
                    <Input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search by city, area, or pincode..."
                        className="border-start-0"
                    />
                </InputGroup>

                {/* Use Current Location Button */}
                <Button
                    color="primary"
                    outline
                    onClick={fetchCurrentLocation}
                    disabled={isLoadingLocation}
                    className="w-100 mb-4 d-flex align-items-center justify-content-center gap-2"
                >
                    <Navigation size={18} />
                    {isLoadingLocation ? 'Detecting location...' : 'Use Current Location'}
                </Button>

                {/* Store List */}
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {filteredStores.length > 0 ? (
                        <ListGroup flush>
                            {filteredStores.map((store) => (
                                <ListGroupItem
                                    key={store._id}
                                    className="border-0 border-bottom py-3 hover-bg-light"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <MapPin size={16} className="text-red-600" />
                                                <strong className="text-dark">{store.name}</strong>
                                            </div>
                                            <p className="text-muted small mb-1">{store.address}</p>
                                            <p className="text-muted small mb-0">
                                                <strong>Pincode:</strong> {store.pincode}
                                            </p>
                                        </div>
                                        <Button
                                            color={location?.location?._id === store._id ? 'success' : 'outline-primary'}
                                            size="sm"
                                            onClick={() => handleSelectStore(store)}
                                            className="ms-3"
                                        >
                                            {location?.location?._id === store._id ? '✓ Selected' : 'Select'}
                                        </Button>
                                    </div>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    ) : (
                        <div className="text-center py-5">
                            <MapPin size={48} className="text-gray-300 mb-3" />
                            <p className="text-muted">No stores found matching your search.</p>
                            <Button
                                color="link"
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilteredStores(storeData);
                                }}
                            >
                                Clear search
                            </Button>
                        </div>
                    )}
                </div>
            </ModalBody>
        </Modal>
    );
}
