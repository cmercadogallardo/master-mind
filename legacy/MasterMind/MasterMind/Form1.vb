Public Class Form1
    Dim clsagente As clsAgente
    Dim oport As Integer = 10
    Dim nturno As Integer = 1
    Dim lalista As DataTable
    Private Sub Form1_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        lalista = New DataTable
        lalista.Columns.Add("lista")
    End Sub

    Private Sub Button1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button1.Click
        Dim resultado As String
        resultado = TextBox1.Text
        clsagente = New clsAgente()
        For nturno = 1 To oport
            Dim strJugada As String = ""
            Dim arrJugada As Array
            arrJugada = clsagente.jugar()
            For n As Integer = 0 To arrJugada.Length - 1
                '' construye salida de la jugada
                strJugada = strJugada & arrJugada(n).ToString()
            Next
            Dim ac As Integer = 0
            For n As Integer = 0 To strJugada.Length - 1
                '' califica la jugada
                If strJugada(n) = resultado(n) Then
                    ac += 1
                End If
            Next
            Me.ListBox1.Items.Add(strJugada & "-->" & ac)
            If ac <> 5 Then
                clsagente.nEx = ac
            Else
                MsgBox("Ya ganastes")
                Exit For
            End If
        Next
    End Sub

    Private Sub Button2_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button2.Click
        clsagente = New clsAgente()
        Me.ListBox1.Items.Clear()
        nturno = 1
    End Sub

    Private Sub Button3_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button3.Click
        DataGridView1.DataSource = clsagente.getJugadas()
    End Sub

    Private Sub Button4_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button4.Click
        Try
            DataGridView1.DataSource = clsagente.getBaseActual()
        Catch ex As Exception

        End Try

    End Sub
End Class
