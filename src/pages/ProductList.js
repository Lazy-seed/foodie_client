import React, { useEffect, useState } from "react";
import JwtApi from "../jwt/JwtApi";
import Loader from "../utilities/Loader";
import { useNavigate, useParams } from "react-router-dom";
import OverLoader from "../utilities/OverLoader";
import toast from "react-hot-toast";

const categories = [
    { id: "Popular", name: "Popular" },
    { id: "Burgers", name: "Burgers" },
    { id: "Beverages", name: "Beverages" },
    { id: "Snacks", name: "Snacks" },
];

export default function ProductList() {
    const { catg } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(catg || "Popular");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("newness");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [useOverLoader, setOverLoader] = useState(false)

    const fetchProducts = async () => {
        setIsLoading(true);
        window.scrollTo(0, 0)
        try {
            const response = await JwtApi.get("/products", {
                category: selectedCategory,
                search: searchQuery,
                sort: sortOption,
                page: currentPage,
            });

            setProducts(response.products);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const addToCart = (productId) => {
        setOverLoader(true)
        JwtApi.post('/cart/add', {productId})
            .then((res) => {
                console.log(res)
                toast.success(res?.message)
            })
            .catch((err) => toast.error(err?.response?.data.message ?? "Something went wrong"))
            .finally(() => setOverLoader(false))
    }
  
    useEffect(() => {
        let timeoutId;
        timeoutId = setTimeout(() => {
            fetchProducts();
        }, 300); // Delay of 300ms

        return () => {
            clearTimeout(timeoutId); // Clear the timeout to prevent multiple calls
        };
    }, [selectedCategory, searchQuery, sortOption, currentPage]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
{
    useOverLoader && <OverLoader/>
}

            <section className="menu-grid-section gray-bg pt-110 pb-100">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-lg-12">
                            <div className="foodix-tabs style-two">
                                <ul className="nav nav-tabs">
                                    {categories.map((category) => (
                                        <li key={category.id}>
                                            <button
                                                className={`nav-link ${selectedCategory === category.id && "active"}`}
                                                onClick={() => { handleCategoryChange(category.id); navigate(`/menu/${category.id}`) }}
                                            >
                                                {category.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div >
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="form-control"
                                />
                            </div>
                            <div >
                                <select
                                    className="form-select"
                                    value={sortOption}
                                    onChange={handleSortChange}
                                >
                                    <option value="newness">Sort by Newness</option>
                                    <option value="priceHighToLow">Price High To Low</option>
                                    <option value="priceLowToHigh">Price Low To High</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    <div className="row" style={{ minHeight: "400px" }}>
                        {isLoading && <Loader />}
                        {!isLoading && products.length === 0 && (
                            <p>No products found for the selected filters.</p>
                        )}
                        {!isLoading &&
                            products.map((product) => (
                                <div
                                    key={product._id}
                                    className="col-xl-4 col-md-6 col-sm-12"
                                >
                                    <div className="menu-item style-four mb-30">
                                        <div className="menu-thumbnail">
                                            <img src={product.imgUrl} alt={product.imgUrl} />
                                            <div className="wishlist-btn">
                                                <button>
                                                    <i className="far fa-heart"></i>
                                                </button>
                                            </div>
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    border: `2px ${product.veg ? "green" : "red"} solid`,
                                                    padding: "3px",
                                                    top: "20px",
                                                    left: "20px"
                                                }}
                                            >
                                                <div style={{
                                                    width: "6px",
                                                    height: "6px",
                                                    backgroundColor: product.veg ? "green" : "red",
                                                    borderRadius: "50%"
                                                }}></div>
                                            </div>
                                        </div>
                                        <div className="menu-info">
                                            <div className="menu-meta">
                                                <span className="price">{product.price.toFixed(2)}</span>
                                                <span className="rating">
                                                    <i className="fas fa-star"></i>
                                                    {product.star} ({product.reviews})
                                                </span>
                                            </div>
                                            <h4 className="title">{product.title}</h4>
                                            <ul className="check-list style-one">
                                                {product.description.map((detail, index) => (
                                                    <li key={index}>
                                                        <i className="far fa-check-circle"></i>
                                                        {detail.slice(0, 30)}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button className="theme-btn style-two" onClick={() => addToCart(product._id)}>
                                                <i className="far fa-cart-plus"></i> Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="row mt-4">
                        <div className="col-lg-12">
                            <ul className="foodix-pagination d-flex justify-content-center">
                                <li>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        <i className="far fa-arrow-left"></i>
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`rounded-2 ${currentPage === index + 1 ? "active bg-primary text-white" : ""}`}
                                            style={{ height: "40px", width: "40px" }}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        <i className="far fa-arrow-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
