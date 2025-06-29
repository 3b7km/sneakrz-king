import { Phone, Instagram } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#1e3b60" }}
            >
              About Sneakrz King
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your premier destination for authentic sneakers from the world's
              leading brands.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "#1e3b60" }}
              >
                Our Story
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                SneakrzKing was founded with a simple mission: to provide
                sneaker enthusiasts in Egypt with access to the world's most
                coveted footwear. We understand that sneakers are more than just
                shoes – they're a form of self-expression, a statement of style,
                and a reflection of personality.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Since our inception, we've built strong relationships with
                authorized retailers and verified suppliers worldwide to ensure
                that every pair of sneakers we sell is 100% authentic. Our team
                of sneaker experts carefully curates our collection to bring you
                the latest releases, classic favorites, and hard-to-find gems.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "#1e3b60" }}
              >
                Our Commitment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Authenticity Guaranteed
                  </h3>
                  <p className="text-gray-600">
                    Every sneaker in our collection is verified for authenticity
                    through our rigorous quality control process.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Fast & Secure Delivery
                  </h3>
                  <p className="text-gray-600">
                    We ensure your sneakers reach you quickly and safely with
                    our reliable delivery partners.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Customer Satisfaction
                  </h3>
                  <p className="text-gray-600">
                    Our dedicated support team is always ready to assist you
                    with any questions or concerns.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Competitive Pricing
                  </h3>
                  <p className="text-gray-600">
                    We offer competitive prices without compromising on quality
                    or authenticity.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "#1e3b60" }}
              >
                Contact Us
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Get in Touch</h3>
                  <p className="text-gray-600 mb-4">
                    Have questions about our products or need assistance with
                    your order? We're here to help!
                  </p>
                  <div className="space-y-2">
                    <a
                      href="https://wa.me/201091968021"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      WhatsApp: +20 109 196 8021
                    </a>
                    <a
                      href="https://www.instagram.com/sneakrz.king?igsh=ZHpuZ2lzdm9vdTky"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      <Instagram className="w-4 h-4 mr-2" />
                      @sneakrz.king
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Business Hours</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                    <p>Saturday: 10:00 AM - 6:00 PM</p>
                    <p>Sunday: 12:00 PM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
