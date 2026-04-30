package com.ngonlanh.backend.repository;

import com.ngonlanh.backend.entity.Address;
import com.ngonlanh.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    // Lấy dimage sách địa chỉ của User, cái nào mặc định cho lên đầu
    List<Address> findByUserOrderByIsDefaultDesc(User user);
}