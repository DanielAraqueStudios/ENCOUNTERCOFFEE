<?php
if (!function_exists('encounter_is_store_page')) {
    function encounter_is_store_page() {
        return function_exists('is_woocommerce')
            && (is_woocommerce() || is_cart() || is_checkout() || is_account_page());
    }
}

add_action('wp_enqueue_scripts', function () {
    if (!encounter_is_store_page()) {
        return;
    }

    wp_enqueue_style(
        'encounter-bootstrap-icons',
        'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css',
        [],
        '1.11.3'
    );

    wp_enqueue_style(
        'encounter-custom-store-shell',
        'https://www.encountercolombiancoffee.ca/css/encounter-custom.css',
        ['encounter-bootstrap-icons'],
        '1.0.0'
    );

    wp_enqueue_script(
        'encounter-bootstrap-bundle',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
        [],
        '5.3.3',
        true
    );
}, 20);

add_action('wp_head', function () {
    if (!encounter_is_store_page()) {
        return;
    }
    ?>
    <style>
        header.site-header,
        #site-header,
        .elementor-location-header {
            display: none !important;
        }

        #site-footer,
        .elementor-location-footer,
        footer.site-footer:not(.encounter-site-footer) {
            display: none !important;
        }

        body.woocommerce,
        body.woocommerce-page {
            margin: 0 !important;
            padding: 0 !important;
            background: #f5f0e8;
        }

        .encounter-header,
        .encounter-footer-shell {
            display: block !important;
            width: 100%;
        }

        .encounter-store-shell-main {
            background: #f5f0e8;
            min-height: 40vh;
            padding-bottom: 0;
        }

        .encounter-header .container,
        .encounter-footer-shell .container {
            max-width: 1320px;
            margin: 0 auto;
            padding-left: 12px;
            padding-right: 12px;
        }

        .encounter-header .navbar-fixed-row {
            display: flex !important;
            width: 100%;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 1rem;
            flex-wrap: nowrap;
            position: relative;
        }

        .encounter-header .navbar-logo-section,
        .encounter-header .navbar-nav-section {
            display: flex !important;
            align-items: center !important;
        }

        .encounter-header .navbar-logo-section {
            flex: 0 0 auto;
            min-width: 0;
        }

        .encounter-header .navbar-nav-section {
            flex: 1 1 auto;
            justify-content: flex-end !important;
            min-width: 0;
        }

        .encounter-header .navbar-brand {
            display: flex !important;
            align-items: center !important;
            gap: 12px;
            text-decoration: none;
            min-width: 0;
        }

        .encounter-header .navbar-nav {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-end !important;
            flex-wrap: nowrap !important;
            list-style: none !important;
            margin: 0 !important;
            padding: 0 !important;
            gap: 0 !important;
        }

        .encounter-header .navbar-nav .nav-item {
            display: flex !important;
            align-items: center !important;
            list-style: none !important;
            padding: 0 1.25rem !important;
            margin: 0 !important;
            position: relative;
        }

        .encounter-header .navbar-nav .nav-item img {
            width: 80px !important;
            height: 80px !important;
            margin-right: 8px !important;
            flex-shrink: 0;
        }

        .encounter-header .navbar-nav .nav-link {
            display: inline-block !important;
            color: #FBF6E0 !important;
            text-decoration: none !important;
            font-size: 1.1rem !important;
            font-weight: 500;
            line-height: 1.2;
            white-space: nowrap;
        }

        .encounter-header .navbar-nav .nav-link.active {
            color: #DDC165 !important;
            font-weight: 600;
        }

        .encounter-header .nav-separated .nav-item:not(:last-child)::after {
            content: "";
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 22px;
            background: rgba(221, 193, 101, 0.55);
        }

        .encounter-header .navbar-toggler {
            display: none;
        }

        .encounter-domain-pill {
            background: rgba(255, 255, 255, 0.15);
            border: 1.5px solid rgba(255, 255, 255, 0.4);
            color: #FBF6E0;
            border-radius: 20px;
            padding: 0.25rem 0.85rem;
            font-size: 0.85rem;
            font-weight: 600;
            line-height: 1.6;
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
        }

        .encounter-footer-shell {
            width: 100%;
        }

        .encounter-footer-shell .encounter-site-footer {
            width: 100vw !important;
            max-width: none !important;
            margin-left: calc(50% - 50vw) !important;
            margin-right: calc(50% - 50vw) !important;
            margin-top: 0;
        }

        .encounter-footer-shell .row {
            display: flex;
            flex-wrap: wrap;
        }

        .encounter-footer-shell .col-lg-6,
        .encounter-footer-shell .col-12 {
            box-sizing: border-box;
            width: 100%;
        }

        .encounter-footer-shell .footer-contact-link {
            display: inline-block;
            font-size: clamp(1.1rem, 2vw, 2rem) !important;
            line-height: 1.25 !important;
            max-width: 100%;
            white-space: normal !important;
            overflow-wrap: anywhere;
            word-break: break-word;
        }

        .encounter-footer-shell .footer-bottom-row {
            margin-top: 2.5rem;
            padding-top: 2.25rem;
        }

        .encounter-footer-shell .footer-bottom-row .col-12,
        .encounter-footer-shell .footer-bottom-row,
        .encounter-footer-shell .copyright-text {
            text-align: center !important;
        }

        .encounter-footer-shell .footer-logo {
            display: block;
            margin-left: auto;
            margin-right: auto;
        }

        .encounter-footer-shell .copyright-text {
            margin-top: 0.5rem;
            margin-bottom: 1rem;
            width: 100%;
        }

        .encounter-footer-shell .footer-legal-links {
            margin-top: 0.75rem;
            justify-content: center !important;
            text-align: center !important;
            width: 100%;
        }

        @media (min-width: 992px) {
            .encounter-footer-shell .col-lg-6 {
                width: 50%;
            }
        }

        @media (max-width: 991px) {
            .encounter-header .navbar-fixed-row {
                flex-wrap: nowrap;
            }

            .encounter-header .navbar-logo-section {
                flex: 1 1 auto;
            }

            .encounter-header .navbar-brand {
                max-width: 100%;
                overflow: hidden;
            }

            .encounter-header .navbar-nav .nav-item {
                padding: 0 0.65rem !important;
            }

            .encounter-header .navbar-nav .nav-item img {
                width: 54px !important;
                height: 54px !important;
                margin-right: 6px !important;
            }

            .encounter-header .navbar-nav .nav-link {
                font-size: 0.95rem !important;
            }

            .encounter-footer-shell .footer-contact-link {
                font-size: clamp(1rem, 3vw, 1.5rem) !important;
            }
        }

        @media (max-width: 767px) {
            .encounter-header .navbar-fixed-row {
                gap: 0.75rem;
            }

            .encounter-header .navbar-toggler {
                display: block !important;
                border: none;
                background: transparent;
                padding: 0.25rem 0.5rem;
                margin-left: auto;
                flex: 0 0 auto;
            }

            .encounter-header .navbar-toggler-icon {
                display: block;
                width: 28px;
                height: 28px;
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28251, 246, 224, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;
            }

            .encounter-header .navbar-nav-section {
                display: none !important;
                position: absolute;
                top: calc(100% + 0.75rem);
                left: 12px;
                right: 12px;
                padding: 1rem 1.25rem;
                background: rgba(124, 9, 15, 0.97);
                border: 1px solid rgba(221, 193, 101, 0.3);
                border-radius: 20px;
                box-shadow: 0 18px 40px rgba(30, 45, 68, 0.28);
                z-index: 1000;
            }

            .encounter-header .navbar-nav-section.show {
                display: block !important;
            }

            .encounter-header .navbar-nav {
                flex-direction: column !important;
                align-items: center !important;
                width: 100%;
            }

            .encounter-header .navbar-nav .nav-item {
                width: 100%;
                justify-content: center;
                padding: 0 !important;
            }

            .encounter-header .nav-separated .nav-item:not(:last-child)::after {
                display: none;
            }

            .encounter-header .navbar-nav .nav-link {
                display: block !important;
                width: 100%;
                text-align: center;
                padding: 0.75rem 1rem !important;
                white-space: normal;
            }

            .encounter-header .navbar-nav .nav-item img {
                width: 32px !important;
                height: 32px !important;
            }

            .encounter-header .navbar-brand-image {
                width: 58px !important;
                height: auto !important;
            }

            .encounter-header .navbar-brand-wordmark {
                max-width: 145px !important;
                max-height: 38px !important;
                height: auto !important;
                width: auto !important;
            }

            .encounter-header .ms-3 {
                margin-left: 0 !important;
            }

            .encounter-domain-pill {
                margin-top: 0.5rem;
            }

            .encounter-footer-shell .footer-contact-link {
                font-size: 1.1rem !important;
            }

            .encounter-footer-shell .footer-bottom-row {
                margin-top: 2rem;
                padding-top: 1.75rem;
            }
        }
    </style>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            var toggler = document.querySelector('.encounter-header .navbar-toggler');
            var nav = document.getElementById('encounterStoreNav');

            if (!toggler || !nav) return;

            toggler.addEventListener('click', function () {
                nav.classList.toggle('show');
            });
        });
    </script>
    <?php
}, 99);

add_action('wp_body_open', function () {
    if (!encounter_is_store_page()) {
        return;
    }
    ?>
    <div class="encounter-header">
        <nav class="navbar navbar-expand-lg navbar-burgundy">
            <div class="container">
                <div class="navbar-fixed-row">
                    <div class="navbar-fixed-col navbar-logo-section">
                        <a class="navbar-brand" href="https://www.encountercolombiancoffee.ca/index.html">
                            <img src="https://www.encountercolombiancoffee.ca/images/Home/Logos/Pictograma.png" class="navbar-brand-image" alt="Encounter Colombian Coffee">
                            <img src="https://www.encountercolombiancoffee.ca/images/Home/Logos/Pictogramanombre.png" class="navbar-brand-wordmark" alt="Encounter Colombian Coffee">
                        </a>
                    </div>

                    <button class="navbar-toggler" type="button" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="navbar-nav-section" id="encounterStoreNav">
                        <ul class="navbar-nav nav-separated">
                            <li class="nav-item">
                                <img src="https://www.encountercolombiancoffee.ca/images/Home/Pictogramas%20home/Pictogramasintento.png" alt="Home">
                                <a class="nav-link" href="https://www.encountercolombiancoffee.ca/index.html">Home</a>
                            </li>

                            <li class="nav-item">
                                <img src="https://www.encountercolombiancoffee.ca/images/Home/Pictogramas%20home/Pictogramas06.png" alt="What we do">
                                <a class="nav-link" href="https://www.encountercolombiancoffee.ca/what-we-do.html">What We Do?</a>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link active" href="https://www.encountercolombiancoffee.ca/store/">Store</a>
                            </li>

                            <li class="nav-item ms-3">
                                <span class="encounter-domain-pill">CA <span>.ca</span></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </div>
    <div class="encounter-store-shell-main">
    <?php
}, 5);

add_action('wp_footer', function () {
    if (!encounter_is_store_page()) {
        return;
    }
    ?>
    </div>

    <div class="encounter-footer-shell">
        <footer class="site-footer encounter-site-footer">
            <div class="container">
                <div class="row gy-5 align-items-start">
                    <div class="col-lg-6 col-12 footer-social-block">
                        <h5 class="site-footer-title mb-4">Connect With Us</h5>
                        <p class="footer-body-text">
                            Do you want to contact us?<br>
                            <strong>Follow us on:</strong>
                        </p>
                        <p class="footer-social-links">
                            <a href="https://www.instagram.com/encountercolombiancoffee" target="_blank" class="footer-social-link" rel="noopener">
                                <i class="bi bi-instagram"></i>Instagram
                            </a><br>
                        </p>
                    </div>

                    <div class="col-lg-6 col-12 footer-contact-block">
                        <h5 class="site-footer-title mb-4">Contact Information</h5>

                        <div class="mb-4">
                            <p class="footer-label mb-1"><strong>Email:</strong></p>
                            <a href="mailto:info@encountercolombiancoffee.ca" class="footer-contact-link">info@encountercolombiancoffee.ca</a>
                        </div>

                        <div class="mb-4">
                            <p class="footer-label mb-1"><strong>Website:</strong></p>
                            <a href="https://www.encountercolombiancoffee.ca" class="footer-contact-link">encountercolombiancoffee.ca</a>
                        </div>
                    </div>
                </div>

                <div class="footer-bottom-row">
                    <div class="col-12 text-center">
                        <img src="https://www.encountercolombiancoffee.ca/images/Home/Logos/logo-footer.png" alt="Encounter Colombian Coffee" class="footer-logo">
                        <p class="copyright-text">Copyright © 2025 Encounter Coffee</p>
                        <ul class="footer-legal-links" aria-label="Legal documents">
                            <li><a href="https://www.encountercolombiancoffee.ca/docs/aviso-de-privacidad.pdf" target="_blank" rel="noopener">Privacy Notice</a></li>
                            <li><a href="https://www.encountercolombiancoffee.ca/docs/politica-de-cookies.pdf" target="_blank" rel="noopener">Cookie Policy</a></li>
                            <li><a href="https://www.encountercolombiancoffee.ca/docs/politica-de-tratamiento-de-datos.pdf" target="_blank" rel="noopener">Data Processing Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#81B29A" fill-opacity="1" d="M0,224L34.3,192C68.6,160,137,96,206,90.7C274.3,85,343,139,411,144C480,149,549,107,617,122.7C685.7,139,754,213,823,240C891.4,267,960,245,1029,224C1097.1,203,1166,181,1234,160C1302.9,139,1371,117,1406,106.7L1440,96L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path>
            </svg>
        </footer>
    </div>
    <?php
}, 20);
