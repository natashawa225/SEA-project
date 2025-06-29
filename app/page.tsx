import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Utensils, MapPin, Clock, Shield, Star, Phone, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const features = [
    {
      icon: <Utensils className="h-6 w-6" />,
      title: "Customizable Meal Plans",
      description: "Choose from Diet, Protein, or Royal plans tailored to your nutritional needs",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Nationwide Delivery",
      description: "We deliver fresh, healthy meals to major cities across Indonesia",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Flexible Scheduling",
      description: "Select your preferred delivery days and meal times",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Nutritional Information",
      description: "Detailed nutritional breakdown for every meal we prepare",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-100 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-sm font-medium">
                  🌟 Indonesia's #1 Healthy Meal Service
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">SEA Catering</h1>
                <p className="text-xl md:text-2xl text-emerald-600 font-semibold">"Healthy Meals, Anytime, Anywhere"</p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Welcome to SEA Catering, Indonesia's premier customizable healthy meal service. We deliver nutritious,
                  delicious meals across the nation, making healthy eating convenient and accessible for everyone.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/subscription">Start Your Journey</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/menu">View Meal Plans</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Healthy meal delivery"
                width={500}
                height={500}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose SEA Catering?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best healthy meal experience with our premium services
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meal Plans Preview */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Meal Plans</h2>
            <p className="text-lg text-gray-600">Choose the perfect plan that fits your lifestyle and goals</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Diet Plan",
                price: "Rp30,000",
                description: "Perfect for weight management and healthy living",
                features: ["Low calorie meals", "Balanced nutrition", "Fresh ingredients"],
              },
              {
                name: "Protein Plan",
                price: "Rp40,000",
                description: "Ideal for fitness enthusiasts and muscle building",
                features: ["High protein content", "Post-workout meals", "Energy boosting"],
              },
              {
                name: "Royal Plan",
                price: "Rp60,000",
                description: "Premium meals with gourmet ingredients",
                features: ["Premium ingredients", "Chef-crafted recipes", "Luxury experience"],
              },
            ].map((plan, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-emerald-600">
                    {plan.price}
                    <span className="text-sm text-gray-500 font-normal">/meal</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-emerald-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full">
                    <Link href="/subscription">Choose Plan</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Join thousands of satisfied customers across Indonesia</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-emerald-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Start Your Healthy Journey?</h2>
          <p className="text-xl mb-12 opacity-90">Contact us today and let us help you achieve your health goals</p>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <User className="h-8 w-8" />
                </div>
                <CardTitle>Manager</CardTitle>
                <CardDescription className="text-white/80">Brian</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <Phone className="h-8 w-8" />
                </div>
                <CardTitle>Phone Number</CardTitle>
                <CardDescription className="text-white/80">08123456789</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/subscription">Subscribe Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-emerald-600 bg-transparent"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}