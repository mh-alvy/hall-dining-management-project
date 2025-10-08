import { supabase } from './supabase';

export async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    const demoStudents = [
      {
        email: 'john.doe@university.edu',
        password: 'student123',
        full_name: 'John Doe',
        phone_number: '+880123456789',
        profile_photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        hall_id: 'HALL-001',
        registration_number: 'REG-2024-001',
        student_id: 'STU-2024-001',
        department: 'Computer Science',
        room_number: '101',
        balance: 5000
      },
      {
        email: 'jane.smith@university.edu',
        password: 'student456',
        full_name: 'Jane Smith',
        phone_number: '+880123456790',
        profile_photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        hall_id: 'HALL-001',
        registration_number: 'REG-2024-002',
        student_id: 'STU-2024-002',
        department: 'Electrical Engineering',
        room_number: '205',
        balance: 3500
      },
      {
        email: 'mike.johnson@university.edu',
        password: 'student789',
        full_name: 'Mike Johnson',
        phone_number: '+880123456791',
        profile_photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        hall_id: 'HALL-001',
        registration_number: 'REG-2024-003',
        student_id: 'STU-2024-003',
        department: 'Mechanical Engineering',
        room_number: '312',
        balance: 2800
      },
      {
        email: 'sarah.wilson@university.edu',
        password: 'student101',
        full_name: 'Sarah Wilson',
        phone_number: '+880123456792',
        profile_photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        hall_id: 'HALL-001',
        registration_number: 'REG-2024-004',
        student_id: 'STU-2024-004',
        department: 'Civil Engineering',
        room_number: '408',
        balance: 4200
      },
      {
        email: 'david.brown@university.edu',
        password: 'student202',
        full_name: 'David Brown',
        phone_number: '+880123456793',
        profile_photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        hall_id: 'HALL-001',
        registration_number: 'REG-2024-005',
        student_id: 'STU-2024-005',
        department: 'Business Administration',
        room_number: '515',
        balance: 3800
      }
    ];

    const adminData = {
      email: 'admin@university.edu',
      password: 'admin123',
      full_name: 'Dr. Ahmed Rahman',
      phone_number: '+880123456700',
      profile_photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    };

    console.log('Creating admin user...');
    const { data: adminAuth, error: adminError } = await supabase.auth.signUp({
      email: adminData.email,
      password: adminData.password,
      options: {
        data: {
          full_name: adminData.full_name,
          phone_number: adminData.phone_number,
          profile_photo: adminData.profile_photo
        }
      }
    });

    if (adminError) {
      console.error('Admin creation error:', adminError);
      return { success: false, error: adminError };
    }

    if (!adminAuth.user) {
      console.error('Admin user not created');
      return { success: false, error: 'Admin user not created' };
    }

    console.log('Admin user created:', adminAuth.user.id);

    const adminUserId = adminAuth.user.id;

    console.log('Creating student users...');
    const studentUserIds: { email: string; userId: string; data: typeof demoStudents[0] }[] = [];

    for (const student of demoStudents) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: student.email,
        password: student.password,
        options: {
          data: {
            full_name: student.full_name,
            phone_number: student.phone_number,
            profile_photo: student.profile_photo
          }
        }
      });

      if (authError) {
        console.error(`Error creating student ${student.email}:`, authError);
        continue;
      }

      if (authData.user) {
        studentUserIds.push({ email: student.email, userId: authData.user.id, data: student });
        console.log(`Student created: ${student.full_name} (${authData.user.id})`);
      }
    }

    console.log('Adding roles...');
    const { error: adminRoleError } = await supabase
      .from('user_roles')
      .insert({ user_id: adminUserId, role: 'admin' });

    if (adminRoleError) {
      console.error('Admin role error:', adminRoleError);
    }

    for (const student of studentUserIds) {
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: student.userId, role: 'student' });

      if (roleError) {
        console.error(`Role error for ${student.email}:`, roleError);
      }
    }

    console.log('Creating student records...');
    for (const student of studentUserIds) {
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: student.userId,
          hall_id: student.data.hall_id,
          registration_number: student.data.registration_number,
          student_id: student.data.student_id,
          department: student.data.department,
          room_number: student.data.room_number,
          balance: student.data.balance
        });

      if (studentError) {
        console.error(`Student record error for ${student.email}:`, studentError);
      }
    }

    console.log('Creating dining month...');
    const { data: diningMonth, error: dmError } = await supabase
      .from('dining_months')
      .insert({
        name: 'January 2025',
        start_date: '2025-01-01',
        end_date: '2025-01-30',
        is_active: true,
        created_by: adminUserId
      })
      .select()
      .single();

    if (dmError) {
      console.error('Dining month error:', dmError);
    } else {
      console.log('Dining month created:', diningMonth.id);

      if (studentUserIds.length >= 4) {
        console.log('Assigning managers...');
        const manager1 = studentUserIds[3];
        const manager2 = studentUserIds[4];

        const { error: m1RoleError } = await supabase
          .from('user_roles')
          .insert({ user_id: manager1.userId, role: 'manager', assigned_by: adminUserId });

        const { error: m2RoleError } = await supabase
          .from('user_roles')
          .insert({ user_id: manager2.userId, role: 'manager', assigned_by: adminUserId });

        const { error: m1Error } = await supabase
          .from('managers')
          .insert({
            user_id: manager1.userId,
            dining_month_id: diningMonth.id,
            assigned_by: adminUserId
          });

        const { error: m2Error } = await supabase
          .from('managers')
          .insert({
            user_id: manager2.userId,
            dining_month_id: diningMonth.id,
            assigned_by: adminUserId
          });

        if (m1RoleError || m2RoleError || m1Error || m2Error) {
          console.error('Manager assignment errors:', { m1RoleError, m2RoleError, m1Error, m2Error });
        } else {
          console.log('Managers assigned successfully');
        }
      }
    }

    console.log('Database seeding completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Seeding error:', error);
    return { success: false, error };
  }
}
