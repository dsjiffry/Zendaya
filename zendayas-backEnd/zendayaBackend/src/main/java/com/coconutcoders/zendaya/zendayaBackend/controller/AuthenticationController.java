package com.coconutcoders.zendaya.zendayaBackend.controller;


import com.coconutcoders.zendaya.zendayaBackend.model.User;
import com.coconutcoders.zendaya.zendayaBackend.repo.UserRepo;
import com.coconutcoders.zendaya.zendayaBackend.util.security.M_UserDetailsService;
import com.coconutcoders.zendaya.zendayaBackend.util.security.MyUserDetailService;
import com.coconutcoders.zendaya.zendayaBackend.util.security.model.AuthenticationRequest;
import com.coconutcoders.zendaya.zendayaBackend.util.security.model.AuthenticationResponse;
import com.coconutcoders.zendaya.zendayaBackend.util.security.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private MyUserDetailService m_userDetailsService;

    @Autowired
    private JwtUtil jwtTokenUtil;

    @Autowired
    UserRepo userRepo;

    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception
    {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authenticationRequest.getUserName(),
                            authenticationRequest.getPassword())
                    );
        } catch (BadCredentialsException e) {
            throw new Exception("Incorrect Username and Password");
        }


        final UserDetails userDetails = m_userDetailsService.loadUserByUsername(authenticationRequest.getUserName());
        final String jwt = jwtTokenUtil.generateToken(userDetails);

        return ResponseEntity.ok(new AuthenticationResponse(jwt));

    }

}
