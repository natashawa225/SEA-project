"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Star, Loader2, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { createTestimonial } from "@/lib/supabase-client"

export function TestimonialForm() {
  const [formData, setFormData] = useState({
    customerName: "",
    reviewMessage: "",
    rating: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.customerName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your name",
        variant: "destructive",
      })
      return
    }

    if (!formData.reviewMessage.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your review message",
        variant: "destructive",
      })
      return
    }

    if (formData.rating === 0) {
      toast({
        title: "Validation Error",
        description: "Please select a rating",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await createTestimonial({
        customer_name: formData.customerName.trim(),
        review_message: formData.reviewMessage.trim(),
        rating: formData.rating,
      })

      toast({
        title: "Thank You!",
        description: "Your testimonial has been submitted successfully. It will be reviewed and published soon.",
      })

      setFormData({
        customerName: "",
        reviewMessage: "",
        rating: 0,
      })
    } catch (error) {
      console.error("Testimonial submission error:", error)
      toast({
        title: "Error",
        description: "Failed to submit testimonial. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-emerald-600" />
          Submit Your Testimonial
        </CardTitle>
        <CardDescription>Share your experience with SEA Catering and help others make healthy choices</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="customerName">Your Name *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="rating">Rating *</Label>
            <div className="flex items-center space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => handleRatingClick(star)} className="focus:outline-none">
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      star <= formData.rating ? "text-yellow-400 fill-current" : "text-gray-300 hover:text-yellow-200",
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {formData.rating > 0 && `${formData.rating} out of 5 stars`}
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="reviewMessage">Your Review *</Label>
            <Textarea
              id="reviewMessage"
              value={formData.reviewMessage}
              onChange={(e) => setFormData((prev) => ({ ...prev, reviewMessage: e.target.value }))}
              placeholder="Tell us about your experience with SEA Catering..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Testimonial"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
