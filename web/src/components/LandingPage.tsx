type LandingPageProps = {
  onLoginClick: () => void
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  return (
    <>
      <header className="masthead">
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-xl-6">
              <div className="text-center text-white">
                <h1 className="mb-5">Thus far the LORD has helped us.</h1>
                <h2 className="trailing mb-6">-- 1 Samuel 7:12, NKJV</h2>
                <div className="d-flex justify-content-center mt-4">
                  <button type="button" className="btn btn-lg btn-light" onClick={onLoginClick}>
                    Go to Login / Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="features-icons bg-light text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                <div className="features-icons-icon d-flex">
                  <i className="bi-window m-auto text-primary" />
                </div>
                <h3>Take Quick Notes</h3>
                <p className="lead mb-0">
                  Moved by Scripture or prayer? Save your thoughts in moments.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                <div className="features-icons-icon d-flex">
                  <i className="bi-layers m-auto text-primary" />
                </div>
                <h3>Connect Sermons</h3>
                <p className="lead mb-0">
                  Need clarity on a chapter? Access related sermons with ease.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="features-icons-item mx-auto mb-0 mb-lg-3">
                <div className="features-icons-icon d-flex">
                  <i className="bi-terminal m-auto text-primary" />
                </div>
                <h3>Easy to Use</h3>
                <p className="lead mb-0">
                  Begin today, grow daily. Witness His work in your spiritual journey!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="showcase">
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div
              className="col-lg-6 order-lg-2 text-white showcase-img"
              style={{ backgroundImage: "url('/assets/img/connectsermons.png')" }}
            />
            <div className="col-lg-6 order-lg-1 my-auto showcase-text">
              <h2>Study with Sermons</h2>
              <p className="lead mb-0">
                Our integrated sermon library from{' '}
                <b>
                  <a href="https://riversidecalvary.com/" target="_blank" rel="noreferrer">
                    Riverside Calvary Chapel
                  </a>
                </b>{' '}
                offers expository preaching on every chapter of the Bible. With over 1,500
                messages available a click away, you&apos;ll always find relevant pastoral
                teaching to complement your personal Bible study.
              </p>
            </div>
          </div>
          <div className="row g-0">
            <div
              className="col-lg-6 text-white showcase-img"
              style={{ backgroundImage: "url('/assets/img/addverse.png')" }}
            />
            <div className="col-lg-6 my-auto showcase-text">
              <h2>Smart Scripture Input</h2>
              <p className="lead mb-0">
                Type it, pick it, or snap it - our intelligent system recognizes Bible
                references in multiple formats and even from photos, making verse entry
                effortless however you prefer to study.
              </p>
            </div>
          </div>
          <div className="row g-0">
            <div
              className="col-lg-6 order-lg-2 text-white showcase-img"
              style={{ backgroundImage: "url('/assets/img/sermonnotes.png')" }}
            />
            <div className="col-lg-6 order-lg-1 my-auto showcase-text">
              <h2>Context-aware for Sermon Notes</h2>
              <p className="lead mb-0">
                During Chapter-Based Sermons, use shortcuts like &quot;V5 powerful
                truth&quot; and it instantly links your comment to that verse. Only works
                when the sermon has a defined Bible chapter reference.
              </p>
              <p className="lead mb-0">
                <b>&quot;V&quot; is the key</b> - works for single verses or ranges like{' '}
                <b>v1, v4-5</b> etc.
              </p>
            </div>
          </div>
          <div className="row g-0">
            <div
              className="col-lg-6 text-white showcase-img"
              style={{ backgroundImage: "url('/assets/img/mark-reading.png')" }}
            />
            <div className="col-lg-6 my-auto showcase-text">
              <h2>Mark your readings</h2>
              <p className="lead mb-0">
                Visualize your reading progress at a glance. Previously read chapters appear
                in green, today&apos;s reading in blue. Press and hold any chapter to explore
                connected sermons and notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials text-center bg-light">
        <div className="container">
          <h2 className="mb-5">What&apos;s next...</h2>
          <div className="row">
            <div className="col-lg-4">
              <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                <img
                  className="img-fluid rounded-circle mb-3"
                  src="/assets/img/next-android.jpg"
                  alt=""
                />
                <h5>Android version</h5>
                <p className="font-weight-light mb-0">Andriod version coming soon.</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                <img
                  className="img-fluid rounded-circle mb-3"
                  src="/assets/img/next-language.jpg"
                  alt=""
                />
                <h5>Multi Language Support</h5>
                <p className="font-weight-light mb-0">
                  Expanding language accessibility beyond our current English and Chinese
                  support.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                <img
                  className="img-fluid rounded-circle mb-3"
                  src="/assets/img/next-versions.jpg"
                  alt=""
                />
                <h5>More Bible Versions</h5>
                <p className="font-weight-light mb-0">
                  Expanding Scripture beyond our current KJV and CUV of public domain
                  versions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="call-to-action text-white text-center" id="download">
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-xl-6">
              <h2 className="mb-4">May this app enrich your walk in faith.</h2>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 h-100 text-center text-lg-start my-auto">
              <ul className="list-inline mb-2">
                <li className="list-inline-item">
                  <a href="/about.html">About</a>
                </li>
                <li className="list-inline-item">⋅</li>
                <li className="list-inline-item">
                  <a href="#!">Contact</a>
                </li>
                <li className="list-inline-item">⋅</li>
                <li className="list-inline-item">
                  <a href="#!">Terms of Use</a>
                </li>
                <li className="list-inline-item">⋅</li>
                <li className="list-inline-item">
                  <a href="/privacy.html">Privacy Policy</a>
                </li>
              </ul>
              <p className="text-muted small mb-4 mb-lg-0">
                &copy; StoneOfHope 2026. All Rights Reserved.
              </p>
            </div>
            <div className="col-lg-6 h-100 text-center text-lg-end my-auto" />
          </div>
        </div>
      </footer>
    </>
  )
}
