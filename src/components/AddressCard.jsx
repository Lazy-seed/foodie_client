import React from 'react';
import { MapPin, Home, Briefcase, Tag, Edit2, Trash2, Check } from 'react-feather';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault, isDefault }) => {
    const getTagIcon = (tag) => {
        switch (tag) {
            case 'Home': return <Home size={16} className="text-blue-600" />;
            case 'Work': return <Briefcase size={16} className="text-purple-600" />;
            case 'Other': return <Tag size={16} className="text-gray-600" />;
            default: return <MapPin size={16} />;
        }
    };

    const getTagColor = (tag) => {
        switch (tag) {
            case 'Home': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Work': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Other': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={`relative p-5 rounded-xl border-2 transition-all ${isDefault
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}>
            {/* Default Badge */}
            {isDefault && (
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                        <Check size={12} />
                        Default
                    </span>
                </div>
            )}

            {/* Tag */}
            <div className="mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getTagColor(address.tag)}`}>
                    {getTagIcon(address.tag)}
                    {address.tag}
                </span>
            </div>

            {/* Name */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {address.firstName} {address.lastName}
            </h3>

            {/* Address */}
            <div className="space-y-1 text-gray-600 mb-4">
                <p>{address.address.line1}</p>
                {address.address.line2 && <p>{address.address.line2}</p>}
                <p>{address.city}, {address.postcode}</p>
                <p className="font-medium text-gray-900">📞 {address.contact}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-200">
                {!isDefault && (
                    <button
                        onClick={() => onSetDefault(address._id)}
                        className="flex-1 py-2 px-3 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        Set as Default
                    </button>
                )}
                <button
                    onClick={() => onEdit(address)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                >
                    <Edit2 size={18} />
                </button>
                <button
                    onClick={() => onDelete(address._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default AddressCard;
