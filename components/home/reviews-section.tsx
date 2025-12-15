"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, MessageSquare, Send, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const { toast } = useToast();

  // Check if desktop on mount
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.comment.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً نام و نظر خود را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews([newReview.review, ...reviews]);
        setFormData({ name: "", rating: 5, comment: "" });
        setShowForm(false);
        toast({
          title: "موفق",
          description: "نظر شما با موفقیت ثبت شد",
        });
      } else {
        const error = await response.json();
        toast({
          title: "خطا",
          description: error.error || "خطا در ثبت نظر",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "خطا",
        description: "خطا در ثبت نظر. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <section className="py-6 sm:py-8 md:py-10 relative overflow-hidden">
      <div className="container px-4 sm:px-4 relative z-10">
        {/* Mobile Header: Button + Rating Summary */}
        <div className="lg:hidden mb-4 space-y-3">
          {/* Add Review Button - Mobile */}
          {!showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={() => setShowForm(true)}
                variant="outline"
                size="sm"
                className="glass-morphism-light h-9 px-4 text-xs rounded-lg w-full"
              >
                <MessageSquare className="h-3.5 w-3.5 ml-1.5" />
                افزودن نظر
              </Button>
            </motion.div>
          )}
          
          {/* Rating Summary - Mobile */}
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">
                ({averageRating.toFixed(1)}) از {reviews.length} نظر
              </span>
            </div>
          )}
        </div>

        {/* Desktop Layout: Form on left, Reviews on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Review Form - Desktop: Left Side, Mobile: Full Width */}
          <div className="lg:col-span-1 order-2 lg:order-1">

            {/* Review Form */}
            {(showForm || isDesktop) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="sticky top-4"
              >
                <Card className="glass-morphism border-border/30">
                  <CardContent className="p-4 sm:p-5">
                    <div className="hidden lg:block mb-4">
                      <h3 className="text-lg font-semibold mb-1">افزودن نظر</h3>
                      <p className="text-sm text-muted-foreground">نظر خود را با ما به اشتراک بگذارید</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Input
                          placeholder="نام شما"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-background/50"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">امتیاز</label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFormData({ ...formData, rating: star })}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-6 w-6 sm:h-7 sm:w-7 transition-colors ${
                                  star <= formData.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground hover:text-yellow-400"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Textarea
                          placeholder="نظر خود را بنویسید..."
                          value={formData.comment}
                          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                          className="bg-background/50 min-h-[100px] sm:min-h-[120px]"
                          required
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 h-10 sm:h-11"
                        >
                          {isSubmitting ? (
                            "در حال ارسال..."
                          ) : (
                            <>
                              <Send className="h-4 w-4 ml-2" />
                              ارسال نظر
                            </>
                          )}
                        </Button>
                        {showForm && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowForm(false);
                              setFormData({ name: "", rating: 5, comment: "" });
                            }}
                            className="h-10 sm:h-11 lg:hidden"
                          >
                            انصراف
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Reviews List - Desktop: Right Side (2 columns), Mobile: Full Width */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* Rating Summary - Desktop Only (With Stars) */}
            {reviews.length > 0 && (
              <div className="hidden lg:flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    ({averageRating.toFixed(1)}) از {reviews.length} نظر
                  </span>
                </div>
              </div>
            )}

            {/* Reviews List - Vertical Comment Style with Scroll */}
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : reviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6 sm:py-8"
              >
                <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-xs sm:text-sm">
                  هنوز نظری ثبت نشده است. اولین نظر را شما بگذارید!
                </p>
              </motion.div>
            ) : (
              <div className="relative w-full">
                {/* Scrollable Container - Reduced Height */}
                <div className="max-h-[400px] sm:max-h-[500px] md:max-h-[550px] lg:max-h-[600px] overflow-y-auto overflow-x-hidden pr-2 -mr-2 custom-scrollbar">
                  <div className="space-y-3 sm:space-y-4 pr-2">
                    {reviews.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                      >
                        <Card className="glass-morphism border-border/20 hover:border-border/40 transition-all duration-300 rounded-lg sm:rounded-xl max-w-full sm:max-w-[95%] lg:max-w-full">
                          <CardContent className="p-3 sm:p-4">
                            {/* Comment Style Layout */}
                            <div className="flex items-start gap-2 sm:gap-3">
                              {/* Avatar */}
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                {/* Header: Name + Rating + Date */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-sm sm:text-base text-foreground">
                                      {review.name}
                                    </h3>
                                    <div className="flex items-center gap-0.5">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                                            star <= review.rating
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-muted-foreground"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    <span>
                                      {new Date(review.createdAt).toLocaleDateString("fa-IR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Comment Text */}
                                <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap break-words">
                                  {review.comment}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

