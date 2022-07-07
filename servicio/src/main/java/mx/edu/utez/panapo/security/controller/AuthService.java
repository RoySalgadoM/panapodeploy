package mx.edu.utez.panapo.security.controller;

import mx.edu.utez.panapo.security.model.AuthUser;
import mx.edu.utez.panapo.user.controller.UserService;
import mx.edu.utez.panapo.user.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService  implements UserDetailsService {
    @Autowired
    UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        User user = userService.getByUsername(username).get();
        return AuthUser.build(user);
    }
}
