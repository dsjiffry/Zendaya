package com.coconutcoders.zendaya.zendayaBackend.util.security;

import com.coconutcoders.zendaya.zendayaBackend.model.User;
import com.coconutcoders.zendaya.zendayaBackend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {

        User user = userRepo.findUserByUsername(userName);
        //System.out.println(user.getUsername() + " - " + userName);
        if( user == null)
        {
            throw new UsernameNotFoundException(userName);
        }

        return new MyUserPrinciple(user);
    }
}
