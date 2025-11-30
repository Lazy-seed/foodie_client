import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetProductsQuery } from "../features/product/productApiSlice";
import { addToCart } from "../features/cart/cartSlice";
import { useAddToCartApiMutation } from "../features/cart/cartApiSlice";
import { selectCurrentUser } from "../features/auth/authSlice";
import { Heart, ShoppingCart, Star, CheckCircle } from "react-feather";
import toast from "react-hot-toast";

const categories = [
    { id: "all", name: "All" },
    { id: "Popular", name: "Popular" },
    { id: "Burgers", name: "Burgers" },
    { id: "Beverages", name: "Beverages" },
    { id: "Snacks", name: "Snacks" },
];

export default function ProductList() {
    const { catg } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);

    const [selectedCategory, setSelectedCategory] = useState(catg || "all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("newness");
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, isFetching } = useGetProductsQuery({
        category: selectedCategory,
        search: searchQuery,
        sort: sortOption,
        page: currentPage
    });

    const [addToCartApi] = useAddToCartApiMutation();

    const handleAddToCart = async (product) => {
        try {
            if (user) {
                await addToCartApi({ productId: product._id, quantity: 1 }).unwrap();
                toast.success("Added to cart");
            } else {
                dispatch(addToCart(product));
                toast.success("Added to cart (Local)");
            }
        } catch (error) {
            toast.error("Failed to add to cart");
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        navigate(`/menu/${category}`);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                {/* Filters */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex overflow-x-auto pb-2 md:pb-0 space-x-2 w-full md:w-auto">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.id)}
                                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === category.id
                                        ? "bg-red-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            />
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            >
                                <option value="newness">Newest</option>
                                <option value="priceHighToLow">Price: High to Low</option>
                                <option value="priceLowToHigh">Price: Low to High</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {isLoading || isFetching ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {data?.products?.map((product, index) => (
                                <div key={product._id} data-demo={`product-${index + 1}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={product.imgUrl || "https://via.placeholder.com/300"}
                                            alt={product.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm cursor-pointer hover:text-red-600 transition-colors">
                                            <Heart size={18} />
                                        </div>
                                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold bg-white shadow-sm flex items-center gap-1 ${product.veg ? "text-green-600" : "text-red-600"}`}>
                                            <div className={`w-2 h-2 rounded-full ${product.veg ? "bg-green-600" : "bg-red-600"}`}></div>
                                            {product.veg ? "VEG" : "NON-VEG"}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{product.title}</h3>
                                            <span className="flex items-center text-yellow-500 text-sm font-bold">
                                                <Star size={14} className="fill-current mr-1" />
                                                {product.star}
                                            </span>
                                        </div>

                                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>

                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                                            <button
                                                data-demo={`product-${index + 1}-add`}
                                                onClick={() => handleAddToCart(product)}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-medium"
                                            >
                                                <ShoppingCart size={18} /> Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {data?.products?.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No products found.
                            </div>
                        )}

                        {/* Pagination */}
                        {data?.totalPages > 1 && (
                            <div className="flex justify-center mt-12 gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                                >
                                    Prev
                                </button>
                                <span className="px-4 py-2 bg-red-600 text-white rounded-lg">
                                    {currentPage} / {data.totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(data.totalPages, p + 1))}
                                    disabled={currentPage === data.totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
