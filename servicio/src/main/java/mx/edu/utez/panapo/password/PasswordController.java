package mx.edu.utez.panapo.password;

import mx.edu.utez.panapo.utils.EmailService;
import mx.edu.utez.panapo.utils.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = {"*"})
public class PasswordController {
    @Autowired
    EmailService emailService;



}
