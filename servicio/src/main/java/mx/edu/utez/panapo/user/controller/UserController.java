package mx.edu.utez.panapo.user.controller;


import mx.edu.utez.panapo.password.EmailDTO;
import mx.edu.utez.panapo.user.model.User;
import mx.edu.utez.panapo.utils.EmailService;
import mx.edu.utez.panapo.utils.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"*"})
public class UserController {
    @Autowired
    UserService userService;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    EmailService emailService;

    @GetMapping("/")
    public ResponseEntity<Message> getAll(){
        return  userService.findAll();
    }

    @GetMapping("/{id}")
    public  ResponseEntity<Message> getById(@PathVariable("id") long id){
        return  userService.findById(id);
    }

    @PostMapping("/")
    public  ResponseEntity<Message> saveUsersave(@RequestBody UserDTO userDTO){
        return  userService.save(new User(passwordEncoder.encode(userDTO.getPassword()),userDTO.getPerson(),userDTO.getAuthorities()));
    }

    @PostMapping("/save")
    public  ResponseEntity<Message> saveUsernamer(@RequestBody UserDTO userDTO){
        return  userService.save2(new User(userDTO.getUsername(),userDTO.getAuthorities()));
    }
    @PostMapping("/confir/")
    public  ResponseEntity<Message> sdasda(@RequestBody UserDTO userDTO){
        return  userService.savePassword(new User(passwordEncoder.encode(userDTO.getPassword()), userDTO.getCode()));
    }
    @PostMapping("/password/")
    public ResponseEntity<Message> sendMailContact(@RequestBody UserDTO userDTO,
                                                   BindingResult result){
        if(result.hasErrors())
            return new ResponseEntity<>(new Message("Verifique los datos", true, null),
                    HttpStatus.BAD_REQUEST);
        if(emailService.sendEmail(userDTO)){
            return  new ResponseEntity<>(new Message("Correo enviado correctamente", false, userDTO),
                    HttpStatus.OK);
        }else{
            return new ResponseEntity<>(new Message("Error al enviar el correo", true, userDTO),
                    HttpStatus.BAD_REQUEST);
        }
    }


    @PutMapping("/")
    public ResponseEntity<Message> update( @RequestBody UserDTO userDTO){
        return userService.update(new User(userDTO.getId(),userDTO.getPerson(), userDTO.getStatus(), userDTO.getAuthorities()));
    }

    @PutMapping("/update")
    public ResponseEntity<Message> updateAll( @RequestBody UserDTO userDTO){
        return userService.updatePassword(new User(userDTO.getId(),passwordEncoder.encode(userDTO.getPassword())));
    }

    @PutMapping("/estado/")
    public ResponseEntity<Message> updatestado( @RequestBody UserDTO userDTO){
        return userService.updateestado(new User(userDTO.getId(),userDTO.getStatus()));
    }

    @PutMapping("/rol/")
    public ResponseEntity<Message> updateRol( @RequestBody UserDTO userDTO){
        return userService.updateRol(new User(userDTO.getId(), userDTO.getAuthorities()));
    }

    @DeleteMapping("/{id}")
    public  ResponseEntity<Message> deleteById(@PathVariable("id") long id){
        return  userService.deletebyid(id);
    }




}
