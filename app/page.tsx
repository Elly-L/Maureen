import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">FarmConnect</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/shop" className="text-sm font-medium">
              Shop
            </Link>
            <Link href="/about" className="text-sm font-medium">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Connect directly with local farmers and buyers
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  FarmConnect brings together farmers and buyers in a seamless marketplace. Buy and sell fresh
                  agricultural produce directly without intermediaries.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/signup?role=seller">
                    <Button className="w-full">Become a Seller</Button>
                  </Link>
                  <Link href="/shop">
                    <Button variant="outline" className="w-full">
                      Browse Products <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto grid max-w-[500px] grid-cols-2 gap-4">
                <div className="grid gap-4">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lHhjsozGLWgNt4yFrDeBRbgehpNeXM.png"
                    alt="Potatoes in market"
                    width={250}
                    height={300}
                    className="rounded-lg object-cover w-full aspect-[4/5]"
                  />
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QCE7H5bngULNfUn4OwIXSo9SRBVTRb.png"
                    alt="Red onions"
                    width={250}
                    height={250}
                    className="rounded-lg object-cover w-full aspect-square"
                  />
                </div>
                <div className="grid gap-4">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pDRSWIvcc2BYCSGY5QTsiYo5PiHQFO.png"
                    alt="Tomatoes in crates"
                    width={250}
                    height={250}
                    className="rounded-lg object-cover w-full aspect-square"
                  />
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eNBlYlNxta2dPVp8IoWzNwbuwz39jn.png"
                    alt="Fresh cabbage"
                    width={250}
                    height={300}
                    className="rounded-lg object-cover w-full aspect-[4/5]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  FarmConnect makes buying and selling agricultural products simple and direct.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Create an Account</h3>
                <p className="text-gray-500">Sign up as a buyer or seller to start using the platform.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.5 20a5 5 0 0 1 5-5h9a5 5 0 0 1 5 5v1a1 1 0 0 1-1 1h-18a1 1 0 0 1-1-1v-1Z" />
                    <path d="M12 15V9" />
                    <path d="M8 9h8" />
                    <path d="M2.5 9a5 5 0 0 1 5-5h9a5 5 0 0 1 5 5v1a1 1 0 0 1-1 1h-18a1 1 0 0 1-1-1v-1Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">List or Browse Products</h3>
                <p className="text-gray-500">
                  Sellers can list their products while buyers can browse and add items to cart.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Connect Directly</h3>
                <p className="text-gray-500">Buyers contact sellers directly to arrange payment and delivery.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Products</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Browse some of our most popular agricultural products.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
              <div className="group relative overflow-hidden rounded-lg border">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-aPRbmnHeR6Xufl72RJB1AE9VYaW1iK.png"
                  alt="Fresh bananas"
                  width={300}
                  height={300}
                  className="object-cover w-full aspect-square transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    Fresh Bananas
                  </h3>
                  <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Kiambu County
                  </p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-qCSYf34ceDP30WxEeC4JhCGixbONZl.png"
                  alt="Fresh vegetables"
                  width={300}
                  height={300}
                  className="object-cover w-full aspect-square transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    Fresh Vegetables
                  </h3>
                  <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Nairobi County
                  </p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-qP37VnhhhlXL6CGrtn3dHBPXHraH9h.png"
                  alt="Grains and cereals"
                  width={300}
                  height={300}
                  className="object-cover w-full aspect-square transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    Grains & Cereals
                  </h3>
                  <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Nakuru County
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="/shop">
                <Button size="lg">
                  View All Products <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">FarmConnect</span>
          </div>
          <p className="text-center text-sm text-gray-500 md:text-left">
            &copy; {new Date().getFullYear()} FarmConnect. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
