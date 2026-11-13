import React from "react";
import { Helmet } from "react-helmet-async";


export default function Info() {
  return (
    <>
    <Helmet>
            <title>Sell & Buy Phones - FALCON</title>
            <meta name="description" content="Sell your old phone instantly on FALCON..." />
          </Helmet>
    <section className="bg-gradient-to-b from-[#F4F8FF] to-white py-12 md:py-16 text-[#123B75] border-t border-[#DCEBFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">

        {/* Intro */}
        <div className="mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl font-black mb-3 md:mb-4 text-[#123B75]">
            Sell Your Old Phone & Buy Certified Electronics with FALCON
          </h2>
          <p className="mb-3 md:mb-4 text-sm sm:text-base text-[#123B75]/80 leading-relaxed">
            FALCON is India's next-generation platform for selling pre-owned devices and buying certified refurbished gadgets. 
            Enjoy AI-driven valuations, guaranteed doorstep pickups, and lightning-fast direct bank transfers.
          </p>
          <p className="text-sm sm:text-base text-[#123B75]/80 leading-relaxed">
            When you sell your phone on FALCON, every device undergoes our comprehensive 32-point inspection check, ensuring safe recycling and premium reconditioning for second-life buyers.
          </p>
        </div>

        {/* Sell Your Old Phone */}
        <div className="mb-6 md:mb-8">
          <h3 className="text-xl font-semibold mb-2 md:mb-3">Sell Your Old Phone</h3>
          <p className="mb-3 md:mb-4">
            Ready to sell old mobile phone? With FALCON, you can easily get cash for your old mobile phone without leaving home. 
            Just share your phone’s details, and we’ll offer you the best price. It’s that simple:
          </p>
          <ul className="list-disc list-inside space-y-1 md:space-y-2">
            <li>
              <strong>Get an Instant Quote:</strong> Enter your phone’s details on our website or app.
            </li>
            <li>
              <strong>Free Home Pickup:</strong> Book a convenient time, and we’ll pick up your phone from your doorstep.
            </li>
            <li>
              <strong>Instant Cash Payment:</strong> Receive cash on the spot upon pickup.
            </li>
          </ul>
        </div>

        {/* Brands */}
        <div className="mb-6 md:mb-8">
          <h3 className="text-xl font-semibold mb-2 md:mb-3">
            Which Mobile Phone Brands Can Be Sold and Bought On FALCON?
          </h3>
          <p className="mb-3 md:mb-4">
            You can buy or sell almost all mobile phone brands in India. Popular laptops, tablets, and gaming consoles are also available. 
            FALCON has more than 20 phone brands, and for every device you sell we offer:
          </p>
          <ul className="list-disc list-inside space-y-1 md:space-y-2">
            <li>Assured sale at best price</li>
            <li>Hassle free</li>
            <li>Free home pick up</li>
            <li>Instant cash payment on pickup</li>
          </ul>
        </div>

        {/* Buy Old Mobile Phones */}
        <div className="mb-6 md:mb-8">
          <h3 className="text-xl font-semibold mb-2 md:mb-3">Buy Old Mobile Phones</h3>
          <p className="mb-3 md:mb-4">
            FALCON offers an affordable way to upgrade to a new phone. You can explore the vast selection of refurbished phones at low price. 
            With FALCON, you can be assured that you will get a highly functional phone. All refurbished phones are tested with proper quality checks to maintain the quality. 
            On top of that, you get:
          </p>
          <ul className="list-disc list-inside space-y-1 md:space-y-2">
            <li>High-quality refurbished phones at affordable prices</li>
            <li>32-point quality checks</li>
            <li>6-month warranty on all refurbished phones</li>
            <li>15 days replacement</li>
          </ul>
          <p className="mt-3 md:mt-4">
            Upgrade your phone without stretching your budget. Discover our wide range of old mobile phones and get yours today at nearly half the price.
          </p>
        </div>

        {/* How to Buy */}
        <div className="mb-6 md:mb-8">
          <h3 className="text-xl font-semibold mb-2 md:mb-3">How to Buy Old Phone From FALCON</h3>
          <p className="mb-3 md:mb-4">
            Buying old mobile phone from FALCON is very easy and convenient. Just follow these steps:
          </p>
          <ul className="list-disc list-inside space-y-1 md:space-y-2">
            <li>Visit the website or App</li>
            <li>Click on the Buy Phone section to select the brand you want to purchase.</li>
            <li>Choose the model and condition (Fair, Good, Superb). Based on your choice, the price will be displayed.</li>
            <li>Enter your address and payment mode.</li>
            <li>Make the payment and your device will be delivered to your doorstep.</li>
          </ul>
          <p className="mt-3 md:mt-4">
            With FALCON, your privacy is safe. We carefully clean every old phone to ensure that all your data is removed and secured.
          </p>
        </div>

        {/* Closing */}
        <div>
          <p>
            You don’t need to worry about your old phone’s brand when selling or buying through FALCON. 
            We accept phones from most brands, so selling is easy. Pick the phone category, brand, and model you want to sell. 
            You can also choose your brand from the quick links below.
          </p>
        </div>

      </div>
    </section>
    </>
  );
}