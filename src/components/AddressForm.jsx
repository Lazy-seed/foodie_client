import React, { useState } from 'react';
import { MapPin, Home, Briefcase, Tag, X } from 'react-feather';
import toast from 'react-hot-toast';

const AddressForm = ({ onSubmit, onCancel, initialData = null, isLoading = false }) => {
    const [formData, setFormData] = useState(initialData || {
        tag: 'Home',
        firstName: '',
        lastName: '',
        address: {
            line1: '',
            line2: ''
        },
        city: '',
        postcode: '',
        contact: '',
        isDefault: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.firstName || !formData.address.line1 || !formData.city || !formData.postcode || !formData.contact) {
            toast.error('Please fill in all required fields');
            return;
        }

        onSubmit(formData);
    };

    const getTagIcon = (tag) => {
        switch (tag) {
            case 'Home': return <Home size={18} />;
            case 'Work': return <Briefcase size={18} />;
            case 'Other': return <Tag size={18} />;
            default: return <MapPin size={18} />;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tag Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Tag *</label>
                <div className="flex gap-3">
                    {['Home', 'Work', 'Other'].map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, tag }))}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${formData.tag === tag
                                    ? 'border-red-600 bg-red-50 text-red-600'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {getTagIcon(tag)}
                            <span>{tag}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Address Fields */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                <input
                    type="text"
                    name="address.line1"
                    value={formData.address.line1}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                <input
                    type="text"
                    name="address.line2"
                    value={formData.address.line2}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postcode *</label>
                    <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    required
                />
            </div>

            {/* Default Checkbox */}
            <div className="flex items-center">
                <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label className="ml-2 text-sm text-gray-700">Set as default address</label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Saving...' : initialData ? 'Update Address' : 'Add Address'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default AddressForm;
