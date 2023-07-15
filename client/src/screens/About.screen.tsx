const About: React.FC = () => {
  return (
    <div className='About'>
      <div className='About__Content'>
        <h1 className='About__Header'>About Bucketflix</h1>
        <p className='About__Paragraph'>
          Welcome to Bucketflix, a user-friendly web app designed for movie and
          series enthusiasts. We provide a hassle-free platform for you to keep
          track of the movies and series you're currently watching or want to
          watch.
        </p>
        <p className='About__Paragraph'>
          With Bucketflix, you can effortlessly create personalized lists and
          add your favorite titles, whether it's for organizing your ongoing
          series or building a wishlist of must-see movies. You also have the
          option to invite your friends to share and collaborate on lists for
          shows or movies you are watching together.
        </p>
        <p className='About__Paragraph'>
          Bucketflix is designed to be easily accessible, allowing you to update
          essential information such as the current timestamp or episode, which
          streaming platform you are using, and any other personal notes
          whenever you need to.
        </p>
        <h3 className='About__ContactHeader'>Contact Us</h3>
        <p className='About__Paragraph'>
          If you have any questions or need assistance, please feel free to
          reach out to us at{' '}
          <a
            className='About__Email'
            href='mailto: contact@bucketflix.com'
            target='_blank'
            rel='noreferrer'
          >
            contact@bucketflix.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default About;
