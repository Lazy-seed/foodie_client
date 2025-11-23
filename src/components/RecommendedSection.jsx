import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart } from '../features/cart/cartSlice';
import { selectCurrentUser } from '../features/auth/authSlice';
import JwtApi from '../api/JwtApi';

const RecommendedSection = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPersonalized, setIsPersonalized] = useState(false);

    useEffect(() => {
        fetchRecommendations();
    }, [user]);

    const fetchRecommendations = async () => {
        setIsLoading(true);
        try {
            const res = await JwtApi.get('recommendations');
            setRecommendations(res.recommendations || []);
            setIsPersonalized(res.isPersonalized || false);
        } catch (err) {
            console.error('Failed to fetch recommendations:', err);
            // Fallback to popular products
            try {
                const fallback = await JwtApi.get('recommendations/popular');
                setRecommendations(fallback.products || []);
            } catch (fallbackErr) {
                console.error('Failed to fetch popular products:', fallbackErr);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        toast.success(`${product.title} added to cart!`);
    };

    if (isLoading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="h-8 w-64 bg-gray-200 rounded mx-auto animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-4 animate-pulse">
                                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (recommendations.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        {isPersonalized ? '✨ Recommended For You' : '🔥 Popular Dishes'}
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        {isPersonalized
                            ? 'Based on your previous orders, we think you\'ll love these!'
                            : 'Discover our most loved dishes'}
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendations.map((product) => (
                        <div
                            key={product._id}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            {/* Product Image */}
                            <div className="relative overflow-hidden">
                                <Link to={`/food/${product._id}`}>
                                    <img
                                        src={product.imgUrl || product.image01 || 'https://via.placeholder.com/300'}
                                        alt={product.title}
                                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </Link>

                                {/* Favorite Button */}
                                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors">
                                    <Heart size={20} className="text-gray-600 hover:text-red-600" />
                                </button>

                                {/* Category Badge */}
                                {product.category && (
                                    <div className="absolute top-3 left-3">
                                        <span className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
                                            {product.category}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-5">
                                <Link to={`/food/${product._id}`}>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 hover:text-red-600 transition-colors">
                                        {product.title}
                                    </h3>
                                </Link>

                                {product.desc && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {product.desc}
                                    </p>
                                )}

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-3">
                                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {product.rating || '4.5'}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        ({product.reviews || '120'})
                                    </span>
                                </div>

                                {/* Price and Add to Cart */}
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-red-600">
                                            ₹{product.price}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-gray-400 line-through">
                                                ₹{product.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                                    >
                                        <ShoppingCart size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        to="/menu/Popular"
                        className="inline-flex items-center px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                        View All Menu
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default RecommendedSection;
