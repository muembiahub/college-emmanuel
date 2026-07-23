-- SQL Script for School Management System (PostgreSQL/Supabase)
-- Version 2: Extended Schema with new features and RLS policies
-- Adapted for DRC educational context - Updated 2026-07-12

-- Disable foreign key checks for initial setup (useful for bulk inserts or reordering)
-- SET session_replication_role = 'replica';

-- Drop existing tables if they exist (CASCADE will drop dependent objects like views, foreign keys)
DROP TABLE IF EXISTS bulletins CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS presences CASCADE;
DROP TABLE IF EXISTS absences CASCADE;
DROP TABLE IF EXISTS historique_scolaire CASCADE;
DROP TABLE IF EXISTS attributions CASCADE;
DROP TABLE IF EXISTS paiements CASCADE;
DROP TABLE IF EXISTS inscriptions CASCADE;
DROP TABLE IF EXISTS eleves CASCADE;
DROP TABLE IF EXISTS parents CASCADE;
DROP TABLE IF EXISTS cours CASCADE;
DROP TABLE IF EXISTS enseignants CASCADE;
DROP TABLE IF EXISTS paralleles CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS niveaux CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS sections CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- Table: utilisateurs (for authentication and roles)
CREATE TABLE utilisateurs (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'Admin', 'Direction', 'Enseignant', 'Parent', 'Eleve', 'Comptable'
    )),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: sections
CREATE TABLE sections (
    section_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_section VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'Maternelle', 'Primaire', 'Secondaire'
    logo TEXT, -- URL to logo
    couleur VARCHAR(7), -- Hex color code, e.g., '#FF0000'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: options (for secondary and technical sections)
CREATE TABLE options (
    option_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_option VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'Scientifique', 'Littéraire', 'Commerciale', 'Mécanique Auto'
    code VARCHAR(10) UNIQUE, -- Short code for the option, e.g., 'SC', 'CO'
    ordre INT DEFAULT 0, -- Order for display
    section_id UUID NOT NULL REFERENCES sections(section_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: niveaux (e.g., 'PS', '1ère Primaire', '7ème', '1ère Sciences')
CREATE TABLE niveaux (
    niveau_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_niveau VARCHAR(100) UNIQUE NOT NULL,
    ordre INT DEFAULT 0, -- Order for display
    section_id UUID NOT NULL REFERENCES sections(section_id) ON DELETE CASCADE,
    option_id UUID REFERENCES options(option_id) ON DELETE SET NULL, -- Nullable for non-option-specific levels
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: enseignants
CREATE TABLE enseignants (
    enseignant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES utilisateurs(user_id) ON DELETE SET NULL, -- Link to user account
    matricule VARCHAR(20) UNIQUE,
    nom VARCHAR(100) NOT NULL,
    post_nom VARCHAR(100),
    prenom VARCHAR(100) NOT NULL,
    sexe VARCHAR(10) NOT NULL CHECK (sexe IN ('Masculin', 'Féminin')),
    date_naissance DATE,
    photo TEXT, -- URL to photo
    telephone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    eleve_adresse TEXT,
    date_embauche DATE DEFAULT CURRENT_DATE,
    statut VARCHAR(50) DEFAULT 'Actif' CHECK (statut IN ('Actif', 'Inactif', 'Congé')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: classes (specific class instances, e.g., 'PS A', '1ère Primaire B')
CREATE TABLE classes (
    classe_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_classe VARCHAR(10) NOT NULL, -- e.g., 'A', 'B', 'C'
    niveau_id UUID NOT NULL REFERENCES niveaux(niveau_id) ON DELETE CASCADE,
    capacite INT DEFAULT 30,
    titulaire_enseignant_id UUID REFERENCES enseignants(enseignant_id) ON DELETE SET NULL, -- Teacher responsible for the class
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (nom_classe, niveau_id)
);

-- Table: paralleles (groups within a class, if applicable, e.g., 'Parallèle 1', 'Parallèle 2')
CREATE TABLE paralleles (
    parallele_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_parallele VARCHAR(50) NOT NULL, -- e.g., 'P1', 'P2'
    classe_id UUID NOT NULL REFERENCES classes(classe_id) ON DELETE CASCADE,
    responsable_enseignant_id UUID REFERENCES enseignants(enseignant_id) ON DELETE SET NULL, -- Teacher responsible for the parallel
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (nom_parallele, classe_id)
);

-- Table: eleves
CREATE TABLE eleves (
    eleve_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES utilisateurs(user_id) ON DELETE SET NULL, -- Link to user account
    matricule VARCHAR(20) UNIQUE,
    nom VARCHAR(100) NOT NULL,
    post_nom VARCHAR(100),
    prenom VARCHAR(100) NOT NULL,
    sexe VARCHAR(10) NOT NULL CHECK (sexe IN ('Masculin', 'Féminin')),
    date_naissance DATE,
    lieu_naissance VARCHAR(100),
    nationalite VARCHAR(100) DEFAULT 'Congolaise',
    photo TEXT, -- URL to photo
    numero_national VARCHAR(20) UNIQUE, -- National identification number
    telephone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    eleve_adresse TEXT,
    date_admission DATE DEFAULT CURRENT_DATE,
    statut VARCHAR(50) DEFAULT 'Actif' CHECK (statut IN ('Actif', 'Inactif', 'Diplômé', 'Transféré')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: parents
CREATE TABLE parents (
    parent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES utilisateurs(user_id) ON DELETE SET NULL, -- Link to user account
    nom_pere VARCHAR(200),
    numero_telephone_du_pere VARCHAR(20),
    fonction_du_pere VARCHAR(100),
    nom_mere VARCHAR(200),
    numero_telephone_de_la_mere VARCHAR(20),
    fonction_de_la_mere VARCHAR(100),
    numero_whatsapp VARCHAR(20),
    email VARCHAR(100) UNIQUE, -- Parent's email
    eleve_adresse TEXT, -- Parent's address
    profession VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: inscriptions
CREATE TABLE inscriptions (
    inscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_inscription VARCHAR(50) UNIQUE NOT NULL, -- Unique registration number
    eleve_id UUID NOT NULL REFERENCES eleves(eleve_id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES parents(parent_id) ON DELETE CASCADE,
    niveau_id UUID NOT NULL REFERENCES niveaux(niveau_id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(section_id) ON DELETE CASCADE,
    option_id UUID REFERENCES options(option_id) ON DELETE SET NULL,
    classe_id UUID NOT NULL REFERENCES classes(classe_id) ON DELETE CASCADE,
    parallele_id UUID REFERENCES paralleles(parallele_id) ON DELETE SET NULL,
    date_inscription DATE DEFAULT CURRENT_DATE,
    statut VARCHAR(50) DEFAULT 'Active' CHECK (statut IN ('Active', 'En attente', 'Annulée')),
    montant_paye DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (eleve_id, classe_id) -- Unique per student per class
);

-- Table: historique_scolaire (to track student progression over years/levels)
CREATE TABLE historique_scolaire (
    historique_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eleve_id UUID NOT NULL REFERENCES eleves(eleve_id) ON DELETE CASCADE,
    niveau_id UUID NOT NULL REFERENCES niveaux(niveau_id) ON DELETE CASCADE,
    classe_id UUID NOT NULL REFERENCES classes(classe_id) ON DELETE CASCADE,
    annee_scolaire VARCHAR(9) NOT NULL, -- e.g., '2023-2024'
    resultat VARCHAR(50), -- e.g., 'Admis', 'Redoublant', 'Exclu'
    date_debut DATE,
    date_fin DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (eleve_id, classe_id, annee_scolaire)
);

-- Table: cours
CREATE TABLE cours (
    cours_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_cours VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    niveau_id UUID NOT NULL REFERENCES niveaux(niveau_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: attributions (assigning teachers to courses and classes)
CREATE TABLE attributions (
    attribution_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enseignant_id UUID NOT NULL REFERENCES enseignants(enseignant_id) ON DELETE CASCADE,
    cours_id UUID NOT NULL REFERENCES cours(cours_id) ON DELETE CASCADE,
    classe_id UUID NOT NULL REFERENCES classes(classe_id) ON DELETE CASCADE,
    annee_scolaire VARCHAR(9) NOT NULL, -- e.g., '2023-2024'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (enseignant_id, cours_id, classe_id, annee_scolaire)
);

-- Table: presences (student attendance)
CREATE TABLE presences (
    presence_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eleve_id UUID NOT NULL REFERENCES eleves(eleve_id) ON DELETE CASCADE,
    classe_id UUID NOT NULL REFERENCES classes(classe_id) ON DELETE CASCADE,
    date_presence DATE NOT NULL,
    statut VARCHAR(20) NOT NULL CHECK (statut IN ('Présent', 'Absent', 'Retard', 'Excusé')),
    justification TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (eleve_id, date_presence)
);

-- Table: notes (student grades)
CREATE TABLE notes (
    note_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eleve_id UUID NOT NULL REFERENCES eleves(eleve_id) ON DELETE CASCADE,
    cours_id UUID NOT NULL REFERENCES cours(cours_id) ON DELETE CASCADE,
    enseignant_id UUID REFERENCES enseignants(enseignant_id) ON DELETE SET NULL,
    annee_scolaire VARCHAR(9) NOT NULL,
    periode VARCHAR(50) NOT NULL, -- e.g., 'Trimestre 1', 'Semestre 1'
    type_evaluation VARCHAR(50), -- e.g., 'Interrogation', 'Examen', 'Devoir'
    note DECIMAL(5, 2) NOT NULL,
    commentaire TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (eleve_id, cours_id, annee_scolaire, periode, type_evaluation)
);

-- Table: bulletins (report cards)
CREATE TABLE bulletins (
    bulletin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eleve_id UUID NOT NULL REFERENCES eleves(eleve_id) ON DELETE CASCADE,
    classe_id UUID NOT NULL REFERENCES classes(classe_id) ON DELETE CASCADE,
    annee_scolaire VARCHAR(9) NOT NULL,
    periode VARCHAR(50) NOT NULL, -- e.g., 'Trimestre 1', 'Semestre 1'
    moyenne_generale DECIMAL(5, 2),
    appreciation TEXT,
    date_publication DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (eleve_id, classe_id, annee_scolaire, periode)
);

-- Table: absences (detailed absence records)
CREATE TABLE absences (
    absence_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eleve_id UUID NOT NULL REFERENCES eleves(eleve_id) ON DELETE CASCADE,
    classe_id UUID NOT NULL REFERENCES classes(classe_id) ON DELETE CASCADE,
    date_absence DATE NOT NULL,
    heure_debut TIME,
    heure_fin TIME,
    justifiee BOOLEAN DEFAULT FALSE,
    motif TEXT,
    enseignant_declarant_id UUID REFERENCES enseignants(enseignant_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: paiements
CREATE TABLE paiements (
    paiement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inscription_id UUID NOT NULL REFERENCES inscriptions(inscription_id) ON DELETE CASCADE,
    montant DECIMAL(10, 2) NOT NULL,
    date_paiement DATE DEFAULT CURRENT_DATE,
    type_paiement VARCHAR(50) CHECK (type_paiement IN ('Frais Scolaires', 'Uniforme', 'Manuel', 'Autre')),
    methode_paiement VARCHAR(50) CHECK (methode_paiement IN ('Cash', 'Virement Bancaire', 'Mobile Money', 'Autre')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: notifications
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destinataire_id UUID, -- Can be eleve_id, parent_id, enseignant_id, user_id
    type_destinataire VARCHAR(50) CHECK (type_destinataire IN ('Eleve', 'Parent', 'Enseignant', 'Admin', 'Utilisateur')),
    message TEXT NOT NULL,
    date_envoi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    lue BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_utilisateurs_email ON utilisateurs (email);
CREATE INDEX idx_sections_nom ON sections (nom_section);
CREATE INDEX idx_options_section_id ON options (section_id);
CREATE INDEX idx_niveaux_section_id ON niveaux (section_id);
CREATE INDEX idx_niveaux_option_id ON niveaux (option_id);
CREATE INDEX idx_enseignants_email ON enseignants (email);
CREATE INDEX idx_enseignants_matricule ON enseignants (matricule);
CREATE INDEX idx_classes_niveau_id ON classes (niveau_id);
CREATE INDEX idx_classes_titulaire_enseignant_id ON classes (titulaire_enseignant_id);
CREATE INDEX idx_paralleles_classe_id ON paralleles (classe_id);
CREATE INDEX idx_paralleles_responsable_enseignant_id ON paralleles (responsable_enseignant_id);
CREATE INDEX idx_eleves_nom_prenom ON eleves (nom, prenom);
CREATE INDEX idx_eleves_email ON eleves (email);
CREATE INDEX idx_eleves_matricule ON eleves (matricule);
CREATE INDEX idx_inscriptions_eleve_id ON inscriptions (eleve_id);
CREATE INDEX idx_inscriptions_parent_id ON inscriptions (parent_id);
CREATE INDEX idx_inscriptions_classe_id ON inscriptions (classe_id);
CREATE INDEX idx_historique_scolaire_eleve_id ON historique_scolaire (eleve_id);
CREATE INDEX idx_historique_scolaire_classe_id ON historique_scolaire (classe_id);
CREATE INDEX idx_cours_niveau_id ON cours (niveau_id);
CREATE INDEX idx_attributions_enseignant_id ON attributions (enseignant_id);
CREATE INDEX idx_attributions_cours_id ON attributions (cours_id);
CREATE INDEX idx_attributions_classe_id ON attributions (classe_id);
CREATE INDEX idx_presences_eleve_id_date ON presences (eleve_id, date_presence);
CREATE INDEX idx_notes_eleve_id_cours_annee_periode ON notes (eleve_id, cours_id, annee_scolaire, periode);
CREATE INDEX idx_bulletins_eleve_id_classe_annee_periode ON bulletins (eleve_id, classe_id, annee_scolaire, periode);
CREATE INDEX idx_absences_eleve_id_date ON absences (eleve_id, date_absence);
CREATE INDEX idx_paiements_inscription_id ON paiements (inscription_id);
CREATE INDEX idx_notifications_destinataire_id ON notifications (destinataire_id, type_destinataire);

-- Trigger for updated_at column
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_utilisateurs_updated_at
BEFORE UPDATE ON utilisateurs
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_sections_updated_at
BEFORE UPDATE ON sections
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_options_updated_at
BEFORE UPDATE ON options
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_niveaux_updated_at
BEFORE UPDATE ON niveaux
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON classes
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_paralleles_updated_at
BEFORE UPDATE ON paralleles
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_eleves_updated_at
BEFORE UPDATE ON eleves
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_parents_updated_at
BEFORE UPDATE ON parents
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_inscriptions_updated_at
BEFORE UPDATE ON inscriptions
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_enseignants_updated_at
BEFORE UPDATE ON enseignants
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_historique_scolaire_updated_at
BEFORE UPDATE ON historique_scolaire
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_cours_updated_at
BEFORE UPDATE ON cours
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_attributions_updated_at
BEFORE UPDATE ON attributions
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_presences_updated_at
BEFORE UPDATE ON presences
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON notes
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_bulletins_updated_at
BEFORE UPDATE ON bulletins
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_absences_updated_at
BEFORE UPDATE ON absences
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_paiements_updated_at
BEFORE UPDATE ON paiements
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Re-enable foreign key checks
-- SET session_replication_role = 'origin';

-- SQL Views

-- View: vue_eleves_complet
CREATE OR REPLACE VIEW vue_eleves_complet AS
SELECT
    e.eleve_id,
    e.matricule AS eleve_matricule,
    e.nom AS eleve_nom,
    e.post_nom AS eleve_post_nom,
    e.prenom AS eleve_prenom,
    e.sexe AS eleve_sexe,
    e.date_naissance AS eleve_date_naissance,
    e.lieu_naissance AS eleve_lieu_naissance,
    e.nationalite AS eleve_nationalite,
    e.photo AS eleve_photo,
    e.numero_national AS eleve_numero_national,
    e.telephone AS eleve_telephone,
    e.email AS eleve_email,
    e.eleve_adresse AS eleve_eleve_adresse,
    e.date_admission AS eleve_date_admission,
    e.statut AS eleve_statut,
    
    p.parent_id,
    p.nom_pere,
    p.numero_telephone_du_pere,
    p.fonction_du_pere,
    p.nom_mere,
    p.numero_telephone_de_la_mere,
    p.fonction_de_la_mere,
    p.numero_whatsapp AS parent_numero_whatsapp,
    p.email AS parent_email,
    p.eleve_adresse AS parent_eleve_adresse,
    p.profession AS parent_profession,
    
    i.inscription_id,
    i.numero_inscription,
    i.date_inscription,
    i.statut AS inscription_statut,
    i.montant_paye,
    
    s.section_id,
    s.nom_section,
    s.logo AS section_logo,
    s.couleur AS section_couleur,
    
    opt.option_id,
    opt.nom_option,
    opt.code AS option_code,
    opt.ordre AS option_ordre,
    
    niv.niveau_id,
    niv.nom_niveau,
    niv.ordre AS niveau_ordre,
    
    cl.classe_id,
    cl.nom_classe,
    cl.capacite AS classe_capacite,
    ens_titulaire.nom AS titulaire_nom,
    ens_titulaire.prenom AS titulaire_prenom,
    
    par.parallele_id,
    par.nom_parallele,
    ens_responsable.nom AS responsable_parallele_nom,
    ens_responsable.prenom AS responsable_parallele_prenom
FROM
    eleves e
JOIN
    inscriptions i ON e.eleve_id = i.eleve_id
JOIN
    parents p ON i.parent_id = p.parent_id
JOIN
    sections s ON i.section_id = s.section_id
JOIN
    niveaux niv ON i.niveau_id = niv.niveau_id
JOIN
    classes cl ON i.classe_id = cl.classe_id
LEFT JOIN
    options opt ON i.option_id = opt.option_id
LEFT JOIN
    paralleles par ON i.parallele_id = par.parallele_id
LEFT JOIN
    enseignants ens_titulaire ON cl.titulaire_enseignant_id = ens_titulaire.enseignant_id
LEFT JOIN
    enseignants ens_responsable ON par.responsable_enseignant_id = ens_responsable.enseignant_id;


-- Seed Data (Données de base)

-- Sections
INSERT INTO sections (nom_section, logo, couleur) VALUES
('Maternelle', NULL, '#FFC107'),
('Primaire', NULL, '#4CAF50'),
('Education de Base', NULL, '#2196F3'),
('Secondaire Générale', NULL, '#9C27B0'),
('Secondaire Technique', NULL, '#FF5722')
ON CONFLICT (nom_section) DO NOTHING;

-- Options (for Secondaire Générale and Secondaire Technique)
INSERT INTO options (nom_option, code, ordre, section_id) VALUES
('Sciences', 'SC', 1, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Générale')),
('Commerciale', 'CO', 2, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Générale')),
('Pédagogie', 'PED', 3, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Générale')),
('Mécanique Auto', 'MA', 1, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique')),
('Électricité', 'EL', 2, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique')),
('Mécanique Générale', 'MG', 3, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique')),
('Coupe et Couture', 'CC', 4, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'))
ON CONFLICT (nom_option) DO NOTHING;

-- Niveaux
INSERT INTO niveaux (nom_niveau, ordre, section_id, option_id) VALUES
-- Maternelle
('PS', 1, (SELECT section_id FROM sections WHERE nom_section = 'Maternelle'), NULL),
('MS', 2, (SELECT section_id FROM sections WHERE nom_section = 'Maternelle'), NULL),
('GS', 3, (SELECT section_id FROM sections WHERE nom_section = 'Maternelle'), NULL),

-- Primaire
('1ère Primaire', 1, (SELECT section_id FROM sections WHERE nom_section = 'Primaire'), NULL),
('2ème Primaire', 2, (SELECT section_id FROM sections WHERE nom_section = 'Primaire'), NULL),
('3ème Primaire', 3, (SELECT section_id FROM sections WHERE nom_section = 'Primaire'), NULL),
('4ème Primaire', 4, (SELECT section_id FROM sections WHERE nom_section = 'Primaire'), NULL),
('5ème Primaire', 5, (SELECT section_id FROM sections WHERE nom_section = 'Primaire'), NULL),
('6ème Primaire', 6, (SELECT section_id FROM sections WHERE nom_section = 'Primaire'), NULL),

-- Education de Base (7ème et 8ème)
('7ème', 1, (SELECT section_id FROM sections WHERE nom_section = 'Education de Base'), NULL),
('8ème', 2, (SELECT section_id FROM sections WHERE nom_section = 'Education de Base'), NULL),

-- Secondaire Générale - Sciences
('1ère Sciences', 1, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Générale'), (SELECT option_id FROM options WHERE nom_option = 'Sciences')),
('2ème Sciences', 2, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Générale'), (SELECT option_id FROM options WHERE nom_option = 'Sciences')),
('3ème Sciences', 3, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Générale'), (SELECT option_id FROM options WHERE nom_option = 'Sciences')),
('4ème Sciences', 4, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Générale'), (SELECT option_id FROM options WHERE nom_option = 'Sciences')),

-- Secondaire Générale - Commerciale
('1ère Commerciale', 1, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Générale'), (SELECT option_id FROM options WHERE nom_option = 'Commerciale')),
('2ème Commerciale', 2, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Générale'), (SELECT option_id FROM options WHERE nom_option = 'Commerciale')),
('3ème Commerciale', 3, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Générale'), (SELECT option_id FROM options WHERE nom_option = 'Commerciale')),
('4ème Commerciale', 4, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Générale'), (SELECT option_id FROM options WHERE nom_option = 'Commerciale')),

-- Secondaire Générale - Pédagogie
('1ère Pédagogie', 1, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Générale'), (SELECT option_id FROM options WHERE nom_option = 'Pédagogie')),
('2ème Pédagogie', 2, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Générale'), (SELECT option_id FROM options WHERE nom_option = 'Pédagogie')),
('3ème Pédagogie', 3, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Générale'), (SELECT option_id FROM options WHERE nom_option = 'Pédagogie')),
('4ème Pédagogie', 4, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Générale'), (SELECT option_id FROM options WHERE nom_option = 'Pédagogie')),

-- Secondaire Technique - Mécanique Auto
('1ère Mécanique Auto', 1, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'), (SELECT option_id FROM options WHERE nom_option = 'Mécanique Auto')),
('2ème Mécanique Auto', 2, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'), (SELECT option_id FROM options WHERE nom_option = 'Mécanique Auto')),
('3ème Mécanique Auto', 3, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'), (SELECT option_id FROM options WHERE nom_option = 'Mécanique Auto')),
('4ème Mécanique Auto', 4, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'), (SELECT option_id FROM options WHERE nom_option = 'Mécanique Auto')),

-- Secondaire Technique - Électricité
('1ère Électricité', 1, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'), (SELECT option_id FROM options WHERE nom_option = 'Électricité')),
('2ème Électricité', 2, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'), (SELECT option_id FROM options WHERE nom_option = 'Électricité')),
('3ème Électricité', 3, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'), (SELECT option_id FROM options WHERE nom_option = 'Électricité')),
('4ème Électricité', 4, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'), (SELECT option_id FROM options WHERE nom_option = 'Électricité')),

-- Secondaire Technique - Mécanique Générale
('1ère Mécanique Générale', 1, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'), (SELECT option_id FROM options WHERE nom_option = 'Mécanique Générale')),
('2ème Mécanique Générale', 2, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'), (SELECT option_id FROM options WHERE nom_option = 'Mécanique Générale')),
('3ème Mécanique Générale', 3, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'), (SELECT option_id FROM options WHERE nom_option = 'Mécanique Générale')),
('4ème Mécanique Générale', 4, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'), (SELECT option_id FROM options WHERE nom_option = 'Mécanique Générale')),

-- Secondaire Technique - Coupe et Couture
('1ère Coupe et Couture', 1, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'), (SELECT option_id FROM options WHERE nom_option = 'Coupe et Couture')),
('2ème Coupe et Couture', 2, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'), (SELECT option_id FROM options WHERE nom_option = 'Coupe et Couture')),
('3ème Coupe et Couture', 3, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'), (SELECT option_id FROM options WHERE nom_option = 'Coupe et Couture')),
('4ème Coupe et Couture', 4, (SELECT section_id FROM sections WHERE nom_section = 'Secondaire Technique'), (SELECT option_id FROM options WHERE nom_option = 'Coupe et Couture'))
ON CONFLICT (nom_niveau) DO NOTHING;

-- Enseignants (example)
INSERT INTO enseignants (nom, prenom, sexe, email, telephone, eleve_adresse) VALUES
('Kabongo', 'Jean-Luc', 'Masculin', 'jeanluc.kabongo@example.com', '+243812345678', '123, Av. de la Paix, Kinshasa'),
('Mbuyi', 'Marie', 'Féminin', 'marie.mbuyi@example.com', '+243823456789', '456, Rue du Lac, Lubumbashi')
ON CONFLICT (email) DO NOTHING;

-- Parents (example)
INSERT INTO parents (nom_pere, numero_telephone_du_pere, fonction_du_pere, nom_mere, numero_telephone_de_la_mere, fonction_de_la_mere, numero_whatsapp, email, eleve_adresse, profession) VALUES
('Kalala', '+243851112233', 'Ingénieur', 'Mwamba', '+243854445566', 'Médecin', '+243851112233', 'kalala.parent@example.com', '123, Av. de la Paix, Kinshasa', 'Ingénieur'),
('Lunda', '+243897778899', 'Entrepreneur', 'Kazadi', '+243891112233', 'Enseignante', '+243897778899', 'lunda.parent@example.com', '456, Rue du Lac, Lubumbashi', 'Entrepreneur')
ON CONFLICT (email) DO NOTHING;

-- Eleves (example)
INSERT INTO eleves (nom, post_nom, prenom, sexe, date_naissance, lieu_naissance, nationalite, telephone, email, eleve_adresse, matricule, numero_national, date_admission, statut) VALUES
('Kalala', 'Wa', 'Junior', 'Masculin', '2018-03-15', 'Kinshasa', 'Congolaise', '+243841234567', 'junior.kalala@example.com', '123, Av. de la Paix, Kinshasa', 'ELV001', '12345678901234567890', '2024-09-01', 'Actif'),
('Lunda', 'Na', 'Sarah', 'Féminin', '2012-09-01', 'Lubumbashi', 'Congolaise', '+243847654321', 'sarah.lunda@example.com', '456, Rue du Lac, Lubumbashi', 'ELV002', '09876543210987654321', '2024-09-01', 'Actif')
ON CONFLICT (email) DO NOTHING;

-- Simplified Cours (example, linking to general levels)
INSERT INTO cours (nom_cours, description, niveau_id) VALUES
('Mathématiques PS', 'Initiation aux nombres et formes', (SELECT niveau_id FROM niveaux WHERE nom_niveau = 'PS')),
('Français 1ère Primaire', 'Lecture et écriture de base', (SELECT niveau_id FROM niveaux WHERE nom_niveau = '1ère Primaire')),
('Physique 4ème Sciences', 'Mécanique et Électricité', (SELECT niveau_id FROM niveaux WHERE nom_niveau = '4ème Sciences')),
('Comptabilité 4ème Commerciale', 'Principes de comptabilité', (SELECT niveau_id FROM niveaux WHERE nom_niveau = '4ème Commerciale'))
ON CONFLICT (nom_cours) DO NOTHING;

-- RLS Policies

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE niveaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE enseignants ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE paralleles ENABLE ROW LEVEL SECURITY;
ALTER TABLE eleves ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE historique_scolaire ENABLE ROW LEVEL SECURITY;
ALTER TABLE cours ENABLE ROW LEVEL SECURITY;
ALTER TABLE attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE presences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulletins ENABLE ROW LEVEL SECURITY;
ALTER TABLE absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE paiements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for utilisateurs
CREATE POLICY "Allow all inserts on utilisateurs" ON utilisateurs FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on utilisateurs" ON utilisateurs FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on utilisateurs" ON utilisateurs FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on utilisateurs" ON utilisateurs FOR DELETE TO public USING (true);

-- RLS Policies for sections
CREATE POLICY "Allow all inserts on sections" ON sections FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on sections" ON sections FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on sections" ON sections FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on sections" ON sections FOR DELETE TO public USING (true);

-- RLS Policies for options
CREATE POLICY "Allow all inserts on options" ON options FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on options" ON options FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on options" ON options FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on options" ON options FOR DELETE TO public USING (true);

-- RLS Policies for niveaux
CREATE POLICY "Allow all inserts on niveaux" ON niveaux FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on niveaux" ON niveaux FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on niveaux" ON niveaux FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on niveaux" ON niveaux FOR DELETE TO public USING (true);

-- RLS Policies for enseignants
CREATE POLICY "Allow all inserts on enseignants" ON enseignants FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on enseignants" ON enseignants FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on enseignants" ON enseignants FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on enseignants" ON enseignants FOR DELETE TO public USING (true);

-- RLS Policies for classes
CREATE POLICY "Allow all inserts on classes" ON classes FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on classes" ON classes FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on classes" ON classes FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on classes" ON classes FOR DELETE TO public USING (true);

-- RLS Policies for paralleles
CREATE POLICY "Allow all inserts on paralleles" ON paralleles FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on paralleles" ON paralleles FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on paralleles" ON paralleles FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on paralleles" ON paralleles FOR DELETE TO public USING (true);

-- RLS Policies for eleves
CREATE POLICY "Allow all inserts on eleves" ON eleves FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on eleves" ON eleves FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on eleves" ON eleves FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on eleves" ON eleves FOR DELETE TO public USING (true);

-- RLS Policies for parents
CREATE POLICY "Allow all inserts on parents" ON parents FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on parents" ON parents FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on parents" ON parents FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on parents" ON parents FOR DELETE TO public USING (true);

-- RLS Policies for inscriptions
CREATE POLICY "Allow all inserts on inscriptions" ON inscriptions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on inscriptions" ON inscriptions FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on inscriptions" ON inscriptions FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on inscriptions" ON inscriptions FOR DELETE TO public USING (true);

-- RLS Policies for historique_scolaire
CREATE POLICY "Allow all inserts on historique_scolaire" ON historique_scolaire FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on historique_scolaire" ON historique_scolaire FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on historique_scolaire" ON historique_scolaire FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on historique_scolaire" ON historique_scolaire FOR DELETE TO public USING (true);

-- RLS Policies for cours
CREATE POLICY "Allow all inserts on cours" ON cours FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on cours" ON cours FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on cours" ON cours FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on cours" ON cours FOR DELETE TO public USING (true);

-- RLS Policies for attributions
CREATE POLICY "Allow all inserts on attributions" ON attributions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on attributions" ON attributions FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on attributions" ON attributions FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on attributions" ON attributions FOR DELETE TO public USING (true);

-- RLS Policies for presences
CREATE POLICY "Allow all inserts on presences" ON presences FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on presences" ON presences FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on presences" ON presences FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on presences" ON presences FOR DELETE TO public USING (true);

-- RLS Policies for notes
CREATE POLICY "Allow all inserts on notes" ON notes FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on notes" ON notes FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on notes" ON notes FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on notes" ON notes FOR DELETE TO public USING (true);

-- RLS Policies for bulletins
CREATE POLICY "Allow all inserts on bulletins" ON bulletins FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on bulletins" ON bulletins FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on bulletins" ON bulletins FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on bulletins" ON bulletins FOR DELETE TO public USING (true);

-- RLS Policies for absences
CREATE POLICY "Allow all inserts on absences" ON absences FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on absences" ON absences FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on absences" ON absences FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on absences" ON absences FOR DELETE TO public USING (true);

-- RLS Policies for paiements
CREATE POLICY "Allow all inserts on paiements" ON paiements FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on paiements" ON paiements FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on paiements" ON paiements FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on paiements" ON paiements FOR DELETE TO public USING (true);

-- RLS Policies for notifications
CREATE POLICY "Allow all inserts on notifications" ON notifications FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all selects on notifications" ON notifications FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates on notifications" ON notifications FOR UPDATE TO public USING (true);
CREATE POLICY "Allow all deletes on notifications" ON notifications FOR DELETE TO public USING (true);
