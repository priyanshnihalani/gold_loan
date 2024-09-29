// import './aboutus.css'; // Assuming custom styling exists in this CSS file.
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

function Aboutus() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <div className="relative">
        <img src="/Designer.jpeg" className="w-full h-screen object-cover" alt="Designer Background" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Welcome to Mannat Gold Loans</h1>
          <p className="text-3xl text-white">Let's see About Us.</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Our Mission Section */}
        <section className="mb-16">
          <h2 className="text-4xl text-yellow-600 font-bold mb-6 text-left">Our Mission</h2>
          <p className="text-lg leading-relaxed text-left">
            Our mission is to empower our customers by offering quick and hassle-free gold loan services.
            We aim to make financial resources accessible to everyone, ensuring that our customers can meet
            their personal and business needs with ease.
          </p>
        </section>
        
        {/* Why Choose Us Section */}
        <section className="mb-16">
          <h2 className="text-4xl text-yellow-600 font-bold mb-6 text-left">Why Choose Us?</h2>
          <ul className="list-disc list-inside space-y-4 text-lg">
            <li className='text-left'>Transparency: We believe in complete transparency in our dealings. Our loan processes are straightforward, with no hidden charges.</li>
            <li className='text-left'>Quick Processing: We understand the urgency of financial needs. Our streamlined processes ensure that you receive your loan within a few hours.</li>
            <li className='text-left'>Competitive Interest Rates: We offer competitive interest rates to help you maximize the value of your gold.</li>
            <li className='text-left'>Security of Gold: Your gold is stored securely in our high-tech vaults, and we take full responsibility for its safety.</li>
          </ul>
        </section>
        
        {/* Our History Section */}
        <section className="mb-16">
          <h2 className="text-4xl text-yellow-600 font-bold mb-6 text-left">Our History</h2>
          <p className="text-lg leading-relaxed text-left">
            Mannat Gold Loans was founded in 2004 with the vision to provide accessible financial services to everyone.
            Over the years, we have grown to become one of the most reputable names in the gold loan industry. Our commitment
            to customer satisfaction and ethical practices has been the cornerstone of our success.
          </p>
        </section>
        
        {/* Our Team Section */}
        <section className="mb-16">
          <h2 className="text-4xl text-yellow-600 font-bold mb-6 text-left">Our Team</h2>
          <p className="text-lg leading-relaxed text-left">
            Our team comprises experienced professionals who are dedicated to providing you with the best possible service.
            We believe in building long-term relationships with our customers by offering personalized financial solutions
            tailored to individual needs.
          </p>
        </section>
        
        {/* Our Services Section */}
        <section className="mb-16">
          <h2 className="text-4xl text-yellow-600 font-bold mb-6 text-left">Our Services</h2>
          <ul className="list-disc list-inside space-y-4 text-lg">
            <li className='text-left'>Gold Loans: Quick and easy loans against your gold, with minimal documentation and competitive interest rates.</li>
            <li className='text-left'>Gold Valuation: Accurate and fair valuation of your gold by our expert appraisers.</li>
            <li className='text-left'>Flexible Repayment Options: Tailored repayment plans that suit your financial situation.</li>
          </ul>
        </section>
        
        {/* Visit Us Today Section */}
        <section className="mb-16">
          <h2 className="text-4xl text-yellow-600 font-bold mb-6 text-left">Visit Us Today</h2>
          <p className="text-lg leading-relaxed text-left">
            Whether you need a short-term loan or financial advice, Mannat Gold Loans is here to help.
            Visit our nearest branch or contact us to learn more about how we can assist you with your financial needs.
          </p>
        </section>

      </div>
      
      <Footer />
    </>
  );
}

export default Aboutus;
