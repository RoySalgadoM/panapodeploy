package mx.edu.utez.panapo.utils;

import mx.edu.utez.panapo.StatusProject.StatusProject;
import mx.edu.utez.panapo.StatusProject.StatusProjectRepository;
import mx.edu.utez.panapo.person.model.Person;
import mx.edu.utez.panapo.person.model.PersonRepository;
import mx.edu.utez.panapo.phases.Phases;
import mx.edu.utez.panapo.phases.PhasesRepository;
import mx.edu.utez.panapo.profession.Profession;
import mx.edu.utez.panapo.profession.ProfessionRepository;
import mx.edu.utez.panapo.rol.Rol;
import mx.edu.utez.panapo.rol.RolRepository;
import mx.edu.utez.panapo.rolProject.RolProject;
import mx.edu.utez.panapo.rolProject.RolProjectRepository;
import mx.edu.utez.panapo.stages.Stages;
import mx.edu.utez.panapo.stages.StagesRepository;
import mx.edu.utez.panapo.status.Status;
import mx.edu.utez.panapo.status.StatusRepository;
import mx.edu.utez.panapo.type_client.TypeClient;
import mx.edu.utez.panapo.type_client.TypeClientRepository;
import mx.edu.utez.panapo.user.model.User;
import mx.edu.utez.panapo.user.model.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.AbstractSet;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

@org.springframework.context.annotation.Configuration
public class Configuration implements CommandLineRunner {
    @Autowired
    RolRepository rolRepository;
    @Autowired
    StatusRepository statusRepository;
    @Autowired
    TypeClientRepository typeClientRepository;
    @Autowired
    PhasesRepository phasesRepository;
    @Autowired
    StagesRepository stagesRepository;
    @Autowired
    ProfessionRepository professionRepository;
    @Autowired
    RolProjectRepository rolProjectRepository;
    @Autowired
    StatusProjectRepository statusProjectRepository;
    @Autowired
    PersonRepository personRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Override
    public void run(String ...args){
        if(!userRepository.existsById(1)) {

            rolRepository.save(new Rol("Directivo","Directivo"));
            rolRepository.save(new Rol("Coordinador","Coordinador"));
            rolRepository.save(new Rol("RAPE","Responsable de Proyecto Específico"));
            rolRepository.save(new Rol("RD","Responsable de Desarrollo"));

            statusRepository.save(new Status(1,"Activo"));
            statusRepository.save(new Status(2,"Inactivo"));

            typeClientRepository.save(new TypeClient(1,"Externo"));
            typeClientRepository.save(new TypeClient(2,"Interno"));

            phasesRepository.save(new Phases(1, "Inicio"));
            phasesRepository.save(new Phases(2, "Requerimientos"));
            phasesRepository.save(new Phases(3, "Análisis y diseño"));
            phasesRepository.save(new Phases(4, "Construcción"));
            phasesRepository.save(new Phases(5, "Integración y pruebas"));
            phasesRepository.save(new Phases(6, "Cierre"));

            stagesRepository.save(new Stages(1, "Planeación"));
            stagesRepository.save(new Stages(2, "Realización"));
            stagesRepository.save(new Stages(3, "Control y evaluación"));
            stagesRepository.save(new Stages(4, "Cierre"));

            professionRepository.save(new Profession(1,"Docente"));
            professionRepository.save(new Profession(2,"Becario"));
            professionRepository.save(new Profession(3,"Directivo"));

            rolProjectRepository.save(new RolProject(1,"RD"));
            rolProjectRepository.save(new RolProject(2,"RAPE"));
            rolProjectRepository.save(new RolProject(3,"Analista programador"));

            statusProjectRepository.save(new StatusProject(1,"Prospecto"));
            statusProjectRepository.save(new StatusProject(2,"Activo"));
            statusProjectRepository.save(new StatusProject(3,"Pausado"));
            statusProjectRepository.save(new StatusProject(4,"Cerrado"));
            statusProjectRepository.save(new StatusProject(5,"Cancelado"));

            Profession profession = professionRepository.getById(1L);
            Status status = statusRepository.getById(1L);

            Set<Rol> rol = new HashSet<Rol>();
            Rol rol1 = rolRepository.getById(2L);
            rol.add(rol1);

            Person person = new Person(1,"Erick","Mireles","Merchant","erickmireles@utez.edu.mx", "04-06-1998", "7773799346", profession, status);
            personRepository.save(person);
            User user = new User(1L,passwordEncoder.encode("cdspanapo1"), "",person, rol,status);
            userRepository.saveAndFlush(user);
        }
    }
}
