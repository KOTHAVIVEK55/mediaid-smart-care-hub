
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";

const Appointments = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const departments = [
    "Cardiology", "Neurology", "Orthopedics", "Dermatology", 
    "Pediatrics", "Internal Medicine", "Emergency Medicine"
  ];

  const doctors = [
    { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiology", rating: 4.9 },
    { id: 2, name: "Dr. Michael Brown", specialty: "Neurology", rating: 4.8 },
    { id: 3, name: "Dr. Emily Davis", specialty: "Orthopedics", rating: 4.7 },
    { id: 4, name: "Dr. James Wilson", specialty: "Internal Medicine", rating: 4.9 },
  ];

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  const upcomingAppointments = [
    { id: 1, doctor: "Dr. Sarah Johnson", date: "2024-01-20", time: "10:00 AM", status: "confirmed" },
    { id: 2, doctor: "Dr. Michael Brown", date: "2024-01-25", time: "02:30 PM", status: "pending" },
  ];

  const handleConfirmAppointment = () => {
    if (!selectedDepartment || !selectedDate || !selectedDoctor || !selectedTime) {
      toast.error("Please complete all steps to book your appointment");
      return;
    }

    toast.success("Appointment confirmed successfully!");
    
    // Reset form
    setSelectedDepartment("");
    setSelectedDate(undefined);
    setSelectedDoctor("");
    setSelectedTime("");
  };

  const isFormComplete = selectedDepartment && selectedDate && selectedDoctor && selectedTime;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Schedule a Visit</h1>
          <p className="text-xl text-gray-600">Book your appointment in 4 simple steps</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appointment Form */}
          <div className="space-y-6">
            {/* Step 1: Department */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                  Select Department
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Step 2: Date */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-xl border"
                />
              </CardContent>
            </Card>

            {/* Step 3: Doctor */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                  Select Doctor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {doctors.map((doctor) => (
                    <div 
                      key={doctor.id}
                      className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                        selectedDoctor === doctor.name ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedDoctor(doctor.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                          <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-yellow-600">★ {doctor.rating}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 4: Time */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                  Select Time Slot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        selectedTime === time 
                          ? 'border-blue-600 bg-blue-600 text-white' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Confirm Button */}
            <Button 
              onClick={handleConfirmAppointment}
              disabled={!isFormComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-xl"
              size="lg"
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              Confirm Appointment
            </Button>
          </div>

          {/* Upcoming Appointments */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 bg-white border rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-gray-900">{appointment.doctor}</span>
                      </div>
                      <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                        {appointment.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {appointment.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
