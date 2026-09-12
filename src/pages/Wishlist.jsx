import { useState, useEffect } from 'react';
import { Heart, Package, User, Star, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllWishlists } from '../api/wishlistApi';
import Loading from '../components/Loading';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        setLoading(true);
        const response = await getAllWishlists();

        if (response?.data?.success) {
          setWishlists(response.data.wishlists || []);
        }
      } catch (error) {
        console.error('Error fetching wishlists:', error);
        toast.error('Failed to load wishlists data!', {
          position: 'top-right',
          style: {
            backgroundColor: 'var(--color-card-bg)',
            color: 'var(--color-text-primary)',
            border: '1px solid #f43f5e',
            borderRadius: '12px',
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, []);

  if (loading) return <Loading />;

  // فلترة القوائم النشطة فقط
  const activeWishlists = wishlists.filter(
    (item) => item?.products && item.products.length > 0
  );

  return (
    <div className="p-3 sm:p-6 min-h-screen bg-bg-main text-primary">
      {/* Header Bar - Responsive Flex Layout */}
      <div className="bg-card border border-border-custom rounded-2xl p-4 sm:p-5 px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border border-border-custom rounded-xl flex items-center justify-center bg-bg-main text-rose-500 shrink-0">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-rose-500/10" />
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-secondary tracking-[1.5px] uppercase block">
              Customer Insights
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary mt-0.5">
              Customer Wishlists
            </h1>
          </div>
        </div>

        <div className="w-full sm:w-auto bg-bg-main border border-border-custom px-4 py-2 rounded-xl text-center sm:text-right flex sm:block items-center justify-between">
          <span className="text-xs text-secondary block font-medium">Active Lists</span>
          <span className="text-base sm:text-lg font-bold text-active">{activeWishlists.length}</span>
        </div>
      </div>

      {/* Wishlists Container */}
      {activeWishlists.length === 0 ? (
        <div className="bg-card border border-border-custom rounded-2xl p-8 sm:p-12 text-center max-w-md mx-auto my-8 sm:my-12 shadow-sm">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-bg-main rounded-full flex items-center justify-center mx-auto mb-4 border border-border-custom text-rose-500">
            <Heart className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-primary mb-1">No Active Wishlists</h3>
          <p className="text-xs text-secondary">
            There are currently no saved products in any customer wishlist.
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {activeWishlists.map((item, index) => (
            <div
              key={item._id || index}
              className="bg-card border border-border-custom rounded-2xl p-4 sm:p-5 shadow-sm transition-all hover:border-active/40"
            >
              {/* Card User Header - Responsive Layout */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-border-custom gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-active/10 text-active flex items-center justify-center font-bold text-xs shrink-0">
                    <User size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-primary truncate">
                      {
                         item.user?.username || item.user?.email || item.user?._id
                        || item.user || 'Anonymous User'}
                    </p>
                    { item.user?.email && (
                      <p className="text-[11px] sm:text-xs text-secondary truncate">{item.user.email}</p>
                    )}
                  </div>
                </div>

                <span className="self-start sm:self-auto text-xs font-semibold text-secondary bg-bg-main border border-border-custom px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <Package size={14} className="text-active" />
                  {item.products.length} Saved Items
                </span>
              </div>

              {/* Responsive Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {item.products.map((product, pIndex) => (
                  <div
                    key={`${product._id || pIndex}-${pIndex}`}
                    className="bg-bg-main border border-border-custom rounded-xl p-3 flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div>
                      {/* Image Preview */}
                      <div className="relative h-32 sm:h-36 w-full rounded-lg overflow-hidden mb-3 bg-card border border-border-custom/50 flex items-center justify-center">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <Package className="text-secondary w-8 h-8" />
                        )}
                        {product.category && (
                          <span className="absolute top-2 left-2 bg-card/80 backdrop-blur-md border border-border-custom text-primary text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md uppercase max-w-[80%] truncate">
                            {product.category}
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <h4 className="text-xs sm:text-sm font-bold text-primary truncate mb-1" title={product.name}>
                        {product.name}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-secondary line-clamp-1 mb-2">
                        {product.shortDescription || product.description}
                      </p>
                    </div>

                    {/* Price and Rating */}
                    <div>
                      <div className="flex items-center justify-between my-2 pt-2 border-t border-border-custom/40">
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <Star size={12} className="fill-amber-400" />
                          <span>{product.averageRating || 0}</span>
                          <span className="text-secondary text-[10px]">({product.numReviews || 0})</span>
                        </div>

                        <div className="text-right">
                          {product.discountPrice ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] line-through text-secondary">${product.price}</span>
                              <span className="text-xs sm:text-sm font-extrabold text-active">${product.discountPrice}</span>
                            </div>
                          ) : (
                            <span className="text-xs sm:text-sm font-extrabold text-primary">${product.price}</span>
                          )}
                        </div>
                      </div>

                      {/* Quick View Button */}
                      <button
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="w-full mt-1 bg-card hover:bg-active hover:text-bg-main text-primary border border-border-custom py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye size={13} />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;