import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PRODUCTS = [
  { 
    name: 'Milk', 
    image: '/assets/milk.png',
    color: 'bg-blue-50', 
    textColor: 'text-blue-600',
    hoverColor: 'hover:bg-blue-100'
  },
  { 
    name: 'Onion', 
    image: '/assets/onion.png',
    color: 'bg-purple-50', 
    textColor: 'text-purple-600',
    hoverColor: 'hover:bg-purple-100'
  },
  { 
    name: 'Potato', 
    image: '/assets/potato.png',
    color: 'bg-yellow-50', 
    textColor: 'text-yellow-600',
    hoverColor: 'hover:bg-yellow-100'
  },
  { 
    name: 'Tomato', 
    image: '/assets/tomato.png',
    color: 'bg-red-50', 
    textColor: 'text-red-600',
    hoverColor: 'hover:bg-red-100'
  },
  { 
    name: 'Sugar', 
    image: '/assets/sugar.png',
    color: 'bg-pink-50', 
    textColor: 'text-pink-600',
    hoverColor: 'hover:bg-pink-100'
  },
];

const Products = () => {
  const navigate = useNavigate();

  const handleProductClick = (productName: string) => {
    navigate(`/products/${productName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Select a product to view detailed analytics
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {PRODUCTS.map((product) => (
            <div
              key={product.name}
              onClick={() => handleProductClick(product.name)}
              className={`${product.color} ${product.hoverColor} rounded-xl p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
            >
              <div className="text-center">
                <div className="w-full h-24 sm:h-32 lg:h-40 mb-3 sm:mb-4 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className={`text-base sm:text-lg lg:text-xl font-semibold ${product.textColor}`}>
                  {product.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;