"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Star, Clock, Users, Leaf } from "lucide-react"
import Link from "next/link"
import Image from "next/image"


const mealPlans = [
  {
    id: 1,
    name: "Diet Plan",
    price: 30000,
    description: "Perfect for weight management and healthy living",
    image: "/meal 1.png?height=300&width=400",
    features: ["Low calorie meals (300-500 cal)", "Balanced nutrition", "Fresh ingredients", "Portion controlled"],
    benefits: ["Weight loss support", "Improved metabolism", "Better digestion", "Increased energy"],
    sampleMeals: ["Grilled chicken salad", "Quinoa bowl with vegetables", "Steamed fish with broccoli"],
    nutritionInfo: {
      calories: "300-500",
      protein: "25-30g",
      carbs: "20-35g",
      fat: "10-15g",
    },
  },
  {
    id: 2,
    name: "Protein Plan",
    price: 40000,
    description: "Ideal for fitness enthusiasts and muscle building",
    image: "/meal 2.jpg?height=300&width=400",
    features: ["High protein content (35-45g)", "Post-workout meals", "Energy boosting", "Muscle building support"],
    benefits: ["Muscle growth", "Faster recovery", "Sustained energy", "Athletic performance"],
    sampleMeals: ["Grilled salmon with sweet potato", "Chicken breast with quinoa", "Beef stir-fry with brown rice"],
    nutritionInfo: {
      calories: "500-700",
      protein: "35-45g",
      carbs: "40-55g",
      fat: "15-25g",
    },
  },
  {
    id: 3,
    name: "Royal Plan",
    price: 60000,
    description: "Premium meals with gourmet ingredients",
    image: "/meal 3.jpg?height=300&width=400",
    features: ["Premium ingredients", "Chef-crafted recipes", "Luxury experience", "Gourmet presentation"],
    benefits: ["Fine dining experience", "Exotic flavors", "Premium nutrition", "Culinary excellence"],
    sampleMeals: ["Wagyu beef with truffle sauce", "Lobster thermidor", "Pan-seared duck breast"],
    nutritionInfo: {
      calories: "600-800",
      protein: "30-40g",
      carbs: "45-60g",
      fat: "25-35g",
    },
  },
]


export default function MenuPage() {
  const [selectedPlan, setSelectedPlan] = useState<(typeof mealPlans)[0] | null>(null)

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Meal Plans</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our carefully crafted meal plans designed to meet your specific health and fitness goals
          </p>
        </div>

        {/* Meal Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {mealPlans.map((plan) => (
            <Card key={plan.id} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={plan.image || "/placeholder.svg"}
                  alt={plan.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-emerald-600 text-white">Popular</Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-emerald-600">
                      Rp{plan.price.toLocaleString()}
                      <span className="text-sm text-gray-500 font-normal">/meal</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.8</span>
                  </div>
                </div>
                <CardDescription className="text-base">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-emerald-600 mr-2" />
                      <span>30 min prep</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-emerald-600 mr-2" />
                      <span>1 serving</span>
                    </div>
                    <div className="flex items-center">
                      <Leaf className="h-4 w-4 text-emerald-600 mr-2" />
                      <span>Fresh daily</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-emerald-600 mr-2" />
                      <span>Premium</span>
                    </div>
                  </div>

                  <ul className="space-y-1 text-sm">
                    {plan.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-2 pt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => setSelectedPlan(plan)}
                        >
                          See Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{selectedPlan?.name}</DialogTitle>
                          <DialogDescription className="text-lg">{selectedPlan?.description}</DialogDescription>
                        </DialogHeader>

                        {selectedPlan && (
                          <div className="space-y-6">
                            <div className="relative h-64 rounded-lg overflow-hidden">
                              <Image
                                src={selectedPlan.image || "/placeholder.svg"}
                                alt={selectedPlan.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-3">Key Features</h4>
                                <ul className="space-y-2">
                                  {selectedPlan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-sm">
                                      <Star className="h-4 w-4 text-emerald-600 mr-2" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-3">Health Benefits</h4>
                                <ul className="space-y-2">
                                  {selectedPlan.benefits.map((benefit, idx) => (
                                    <li key={idx} className="flex items-center text-sm">
                                      <Leaf className="h-4 w-4 text-emerald-600 mr-2" />
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-3">Sample Meals</h4>
                              <div className="grid grid-cols-1 gap-2">
                                {selectedPlan.sampleMeals.map((meal, idx) => (
                                  <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm">
                                    {meal}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-3">Nutrition Information (per meal)</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                                  <div className="font-bold text-emerald-600">
                                    {selectedPlan.nutritionInfo.calories}
                                  </div>
                                  <div className="text-sm text-gray-600">Calories</div>
                                </div>
                                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                                  <div className="font-bold text-emerald-600">{selectedPlan.nutritionInfo.protein}</div>
                                  <div className="text-sm text-gray-600">Protein</div>
                                </div>
                                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                                  <div className="font-bold text-emerald-600">{selectedPlan.nutritionInfo.carbs}</div>
                                  <div className="text-sm text-gray-600">Carbs</div>
                                </div>
                                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                                  <div className="font-bold text-emerald-600">{selectedPlan.nutritionInfo.fat}</div>
                                  <div className="text-sm text-gray-600">Fat</div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                              <Button asChild className="flex-1">
                                <Link href="/subscription">Subscribe Now</Link>
                              </Button>
                              <Button variant="outline" className="flex-1 bg-transparent">
                                <Link href="/contact">Contact Us</Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button asChild className="flex-1">
                      <Link href="/subscription">Choose Plan</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-emerald-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Healthy Journey?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their lives with our meal plans
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/subscription">Start Subscription</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
