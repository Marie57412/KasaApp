import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Importez useParams pour extraire l'ID de l'URL
import logementsData from "../data/logements.json"; // Importez les données des logements (assurez-vous que le chemin soit correct)
import CarrouselSlide from "../components/Carrousel"; // Importez le composant de carrousel
import TopbarItem from "../components/TopbarItem"; // Importez le composant de barre supérieure
import Error from "../Pages/Error";
import Accueil from "../Pages/Accueil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

// Composant de la page logements
function Logement() {
  const { logementId } = useParams(); // Utilisez useParams pour extraire l'ID de l'URL
  const [currentLogement, setCurrentLogement] = useState(null);
  const [titles, setTitles] = useState(null);
  const [locations, setLocation] = useState(null);
  const [tags, setTags] = useState([]);
  const [host, setHost] = useState(null);
  const [isValidId, setIsValidId] = useState(true);

  useEffect(() => {
    const selectedLogement = logementsData.find(
      (logement) => logement.id === logementId
    );
    if (selectedLogement) {
      setCurrentLogement(selectedLogement);
      setTitles(selectedLogement.title);
      setLocation(selectedLogement.location); // Met à jour l'état du logement actuel avec les données chargées
      setTags(selectedLogement.tags);
      setHost(selectedLogement.host);
    } else {
      setIsValidId(false); // Marque l'ID comme invalide si le logement n'est pas trouvé
    }
  }, [logementId]);

  if (!currentLogement && isValidId) {
    // Si les données du logement ne sont pas encore chargées et l'ID est valide, affiche un indicateur de chargement ou autre contenu si nécessaire
    return <Accueil />;
  }

  if (!isValidId) {
    // Si l'ID n'est pas valide, affiche la page d'erreur
    return <Error />;
  }

  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const remainingStars = 5 - fullStars; // Calcul des étoiles vides

    const stars = [];

    // Remplir les étoiles pleines
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} color="#FF6060" />);
    }

    // Ajouter les étoiles vides avec bordure noire
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FontAwesomeIcon key={i + fullStars} icon={faStar} color="#E3E3E3" />
      );
    }

    return stars;
  };

  return (
    <div>
      <div>
        {/* Affiche le composant de carrousel en passant le logement actuel en tant que prop */}
        <CarrouselSlide currentLogement={currentLogement} />
      </div>
      {/* Affiche le composant d'étoiles de notation */}
      <div className="content-logement">
        <div className="title_host">
          <h1 className="title-logement">{titles}</h1>
        </div>

        <p className="location-text">{locations}</p>
        <div className="tag-container">
          <div className="tag-logement">
            {tags.map((tag, index) => (
              <p className="tag-text" key={index}>
                {tag}
              </p>
            ))}
          </div>
          <div className="host-container">
            <div className="host">
              <div className="host-content">
                {currentLogement && (
                  <>
                    <p>{currentLogement.host.name}</p>
                    <img
                      className="host-img"
                      src={currentLogement.host.picture}
                      alt="Photo de l'hôte"
                    />
                  </>
                )}
              </div>
              <div className="rating-container">
                <div className="rating-stars">
                  {renderRatingStars(currentLogement.rating)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="topbar-container topbar-carrousel">
        {/* Affiche les éléments de la barre supérieure en passant les données du logement actuel en tant que props */}
        <TopbarItem text={currentLogement?.description} title="Description" />
        <TopbarItem text={currentLogement?.equipments} title="Equipements" />
      </div>
    </div>
  );
}

export default Logement;
