"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    name: "Budi Pekerti",
    rating: 5,
    message:
      "Sejak langganan catering ini, saya nggak pusing lagi mikirin menu sehat buat keluarga. Rasanya enak, porsinya pas, dan yang paling penting: anak-anak juga doyan!",
  },
  {
    id: 2,
    name: "Ahmad Rahman",
    rating: 5,
    message:
      "Awalnya coba-coba buat diet, eh malah keterusan. Makanannya fresh banget, variatif, dan nggak bikin kangen junk food. SEA Catering cocok buat yang sibuk tapi tetap mau jaga pola makan. Protein plannya recommended bangettt!",
  },
  {
    id: 3,
    name: "Maria Santoso",
    rating: 4,
    message:
      "Salah satu investasi terbaik buat kesehatan saya. Setiap box berasa kayak dimasakin chef pribadi. Timnya juga responsif banget kalau ada request khusus.",
  },
  {
    id: 4,
    name: "David Chen Halim",
    rating: 5,
    message:
      "Makannya clean tapi rasanya nggak hambar. Gizi terukur, cocok banget buat support program latihan saya. Highly recommended buat yang hidup aktif dan mindful!",
  },
]

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300",
                        )}
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg text-gray-600 mb-6 italic">"{testimonial.message}"</blockquote>
                  <cite className="text-sm font-semibold text-gray-900">- {testimonial.name}</cite>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center mt-6 space-x-4">
        <Button variant="outline" size="sm" onClick={prevTestimonial} className="rounded-full bg-transparent">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentIndex ? "bg-emerald-600" : "bg-gray-300",
              )}
            />
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={nextTestimonial} className="rounded-full bg-transparent">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
