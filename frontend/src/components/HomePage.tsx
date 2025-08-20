import Hero from './02_hero';
import Services from './03_services/Services';
import FAQ from './04_faq';
import Contact from './06_contact';
import Footer from './07_footer';

const HomePage = () => (
  <div>
    <div id="top"></div>
    <section id="hero">
    <Hero />
    </section>
    <section id="services">
      <Services />
    </section>
    <section id="faq">
      <FAQ />
    </section>
    <section id="reviews">Reviews Section</section>
    <section id="contact"><Contact /></section>
    <section id="footer"><Footer /></section>
    {/* ...other content */}
  </div>
);

export default HomePage;
