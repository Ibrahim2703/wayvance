
document.addEventListener('DOMContentLoaded', () => {

    // --- Auto Carousel Logic ---
    const carouselSlides = document.querySelectorAll('#auto-carousel .carousel-slide');
    if (carouselSlides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            carouselSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % carouselSlides.length;
            carouselSlides[currentSlide].classList.add('active');
        }, 3500); // Change image every 3.5 seconds
    }
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Toggle hamburger icon (optional, can be done with CSS)
            if (navMenu.classList.contains('active')) {
                hamburger.textContent = '✕';
            } else {
                hamburger.textContent = '☰';
            }
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.textContent = '☰';
    }));

    // Header scroll background effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
        } else {
            header.style.boxShadow = "none";
        }
    });

    // --- Simulator Logic ---

    // Tab Switching
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active to clicked
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });
    // --- FAQ Accordion ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;

            // Close other open answers
            faqQuestions.forEach(q => {
                if (q !== question && q.classList.contains('active')) {
                    q.classList.remove('active');
                    q.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle current
            question.classList.toggle('active');
            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
});

// Calculation Functions (Global scope to be accessible by onclick)

function formatMoney(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function calculerSante() {
    const nbBenef = parseInt(document.getElementById('beneficiaires').value);
    const couverture = document.querySelector('input[name="couverture"]:checked').value;

    const age = parseInt(document.getElementById('age-souscripteur').value);

    // Tarif de base par personne (Hypothèse pour la démo)
    // 80% = 12,000 FCFA, 100% = 18,000 FCFA
    let tarifBase = couverture === '80' ? 12000 : 18000;

    // Ajustement selon l'âge
    if (age > 45) {
        tarifBase += 2000;
    } else if (age > 60) {
        tarifBase += 5000;
    }

    // Réduction famille nombreuse
    if (nbBenef >= 3) {
        tarifBase = tarifBase * 0.9;
    }

    const totalMensuel = tarifBase * nbBenef;
    const totalAnnuel = totalMensuel * 12;

    document.getElementById('prix-sante').innerText = formatMoney(totalMensuel);
    document.getElementById('prix-sante-an').innerText = formatMoney(totalAnnuel);
    document.getElementById('result-sante').style.display = 'block';
}


function toggleValeurVehicule() {
    const formule = document.getElementById('formule-auto').value;
    const groupValeur = document.getElementById('group-valeur-vehicule');
    if (formule === 'tousrisques') {
        groupValeur.style.display = 'block';
    } else {
        groupValeur.style.display = 'none';
        document.getElementById('valeur-vehicule').value = '';
    }
}

function toggleChargeUtile() {
    const type = document.getElementById('type-vehicule').value;
    const groupCharge = document.getElementById('group-charge-utile');
    if (['camion', 'camionnette', 'remorque'].includes(type)) {
        groupCharge.style.display = 'block';
    } else {
        groupCharge.style.display = 'none';
    }
}

function calculerAuto() {
    const type = document.getElementById('type-vehicule').value;
    const formule = document.getElementById('formule-auto').value;
    const usage = document.getElementById('usage-vehicule').value;
    const energie = document.getElementById('energie').value;
    const duree = parseInt(document.getElementById('duree-contrat').value);
    const valeur = parseInt(document.getElementById('valeur-vehicule').value) || 0;

    // 1. Tarif de Base Annuel (RC) selon le type
    let primeAnnuelle = 0;
    switch (type) {
        case 'tourisme': primeAnnuelle = 60000; break;
        case '4x4': primeAnnuelle = 85000; break;
        case 'camion': primeAnnuelle = 120000; break;
        case 'camionnette': primeAnnuelle = 70000; break;
        case 'car': primeAnnuelle = 150000; break; // Transport commun
        case 'remorque': primeAnnuelle = 30000; break;
        case 'moto': primeAnnuelle = 25000; break;
        case 'tricycle': primeAnnuelle = 35000; break;
        case 'engin': primeAnnuelle = 100000; break;
        default: primeAnnuelle = 50000;
    }

    // 2. Majoration Usage
    if (usage === 'location') {
        primeAnnuelle *= 1.5; // +50% pour usage commercial/location
    }

    // 3. Majoration Energie (Diesel souvent plus cher)
    if (energie === 'diesel') {
        primeAnnuelle *= 1.1;
    }

    // 4. Calcul Formule
    if (formule === 'complet') {
        primeAnnuelle += 40000; // Forfait Incendie/Vol
    } else if (formule === 'tousrisques') {
        // Tous risques : Prime RC + (Valeur * Taux)
        // Taux approx 4%
        if (valeur > 0) {
            primeAnnuelle += (valeur * 0.04);
        } else {
            alert("Veuillez entrer la valeur du véhicule pour la formule Tous Risques");
            return;
        }
    }

    // 5. Prorata Temporis (Durée) - Tarifs court terme sont souvent majorés proportionnellement
    // Taux court terme : 1 mois = 15%, 3 mois = 30%, 6 mois = 60% de l'annuel souvent
    let primeFinale = 0;
    if (duree === 1) primeFinale = primeAnnuelle * 0.15;
    else if (duree === 3) primeFinale = primeAnnuelle * 0.35;
    else if (duree === 6) primeFinale = primeAnnuelle * 0.65;
    else primeFinale = primeAnnuelle; // 12 mois

    document.getElementById('prix-auto').innerText = formatMoney(Math.round(primeFinale));
    document.getElementById('result-auto').style.display = 'block';

    // Scroll to result slightly
    document.getElementById('result-auto').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// Close modal if user clicks outside of it
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

