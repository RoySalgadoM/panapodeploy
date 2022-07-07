package mx.edu.utez.panapo;

import mx.edu.utez.panapo.person.model.Person;
import mx.edu.utez.panapo.rol.Rol;
import mx.edu.utez.panapo.user.controller.UserService;
import mx.edu.utez.panapo.user.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PanapoApplication {
	public static void main(String[] args) {
		SpringApplication.run(mx.edu.utez.panapo.PanapoApplication.class, args);
	}

}