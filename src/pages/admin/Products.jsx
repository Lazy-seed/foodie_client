import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'react-feather';
import JwtApi from '../../api/JwtApi';
import toast from 'react-hot-toast';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, [page, search, category]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page,
                limit: 12,
                ...(search && { search }),
                ...(category && { category })
            });

            const res = await JwtApi.get(`admin/products?${params}`);
            setProducts(res.products || []);
            setTotalPages(res.totalPages || 1);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAvailability = async (productId) => {
        try {
            await JwtApi.patch(`admin/products/${productId}/availability`);
            toast.success('Product availability updated');
            fetchProducts();
        } catch (error) {
            console.error('Failed to toggle availability:', error);
            toast.error('Failed to update availability');
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await JwtApi.delete(`admin/products/${productId}`);
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error('Failed to delete product');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    >
                        <option value="">All Categories</option>
                        <option value="Burger">Burger</option>
                        <option value="Pizza">Pizza</option>
                        <option value="Sandwich">Sandwich</option>
                        <option value="Mexican">Mexican</option>
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <img
                                    src={product.imgUrl || 'https://via.placeholder.com/300'}
                                    alt={product.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-gray-900 line-clamp-1">{product.title}</h3>
                                        <button
                                            onClick={() => handleToggleAvailability(product._id)}
                                            className={`p-1 rounded ${product.isAvailable ? 'text-green-600' : 'text-gray-400'}`}
                                        >
                                            {product.isAvailable ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xl font-bold text-red-600">₹{product.price}</span>
                                        <span className="text-sm text-gray-600">Stock: {product.stock || 0}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                            <Edit2 size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 bg-gray-100 rounded-lg">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Products;
