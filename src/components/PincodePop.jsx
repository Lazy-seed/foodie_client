import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Search, Navigation, X, Check } from 'react-feather';
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

    if (!location?.showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-2 text-gray-800">
                        <div className="bg-red-50 p-2 rounded-full">
                            <MapPin size={20} className="text-red-600" />
                        </div>
                        <h2 className="font-bold text-lg">Select Your Nearest Store</h2>
                    </div>
                    {location?.location && (
                        <button
                            onClick={handleModal}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="p-6">
                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search by city, area, or pincode..."
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                        />
                    </div>

                    {/* Use Current Location Button */}
                    <button
                        onClick={fetchCurrentLocation}
                        disabled={isLoadingLocation}
                        className="w-full mb-6 flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-red-200 rounded-xl text-red-600 font-medium hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Navigation size={18} className={isLoadingLocation ? "animate-spin" : ""} />
                        {isLoadingLocation ? 'Detecting location...' : 'Use Current Location'}
                    </button>

                    {/* Store List */}
                    <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {filteredStores.length > 0 ? (
                            filteredStores.map((store) => {
                                const isSelected = location?.location?._id === store._id;
                                return (
                                    <div
                                        key={store._id}
                                        onClick={() => handleSelectStore(store)}
                                        className={`group p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${isSelected
                                                ? 'bg-red-50 border-red-200 ring-1 ring-red-200'
                                                : 'bg-white border-gray-100 hover:border-red-200 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className={`font-bold ${isSelected ? 'text-red-700' : 'text-gray-800'}`}>
                                                    {store.name}
                                                </h3>
                                                {isSelected && (
                                                    <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                                        SELECTED
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-500 text-sm mb-1">{store.address}</p>
                                            <p className="text-gray-400 text-xs font-medium">
                                                Pincode: {store.pincode}
                                            </p>
                                        </div>

                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSelected
                                                ? 'bg-red-600 text-white'
                                                : 'bg-gray-100 text-gray-300 group-hover:bg-red-100 group-hover:text-red-600'
                                            }`}>
                                            {isSelected ? <Check size={16} /> : <MapPin size={16} />}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <div className="bg-white p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-sm">
                                    <MapPin size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-gray-900 font-medium mb-1">No stores found</h3>
                                <p className="text-gray-500 text-sm mb-4">We couldn't find any stores matching "{searchTerm}"</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setFilteredStores(storeData);
                                    }}
                                    className="text-red-600 font-medium text-sm hover:underline"
                                >
                                    Clear search & show all
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
